const APP_VERSION = "1.0";

importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js");
  
workbox.setConfig({
  debug: true
});
  
workbox.loadModule('workbox-strategies');
workbox.loadModule('workbox-precaching');
workbox.loadModule('workbox-expiration');
workbox.loadModule('workbox-routing');
workbox.loadModule('workbox-cacheable-response');
workbox.loadModule('workbox-broadcast-update');

const { registerRoute, setDefaultHandler, setCatchHandler } = workbox.routing;
const { NetworkOnly, StaleWhileRevalidate, CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { matchPrecache } = workbox.precaching;
const { BroadcastUpdatePlugin } = workbox.broadcastUpdate;

workbox.precaching.addPlugins([
  new BroadcastUpdatePlugin('precache-channel')
])

// Cache home page for 1 hour
registerRoute(
  ({url}) => url.pathname === "/",
  new StaleWhileRevalidate({
    cacheName: 'home-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 1 * 60 * 60, // 2 hours
      }),
      new BroadcastUpdatePlugin()
    ],
  })
);

// Cache other pages for 2 hours
registerRoute(
  ({request, url}) => request.mode === 'navigate' 
    && !url.pathname.match('Login')
    && !url.pathname.startsWith('/index.php'),
  new StaleWhileRevalidate({
    cacheName: 'page-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 12 * 60 * 60, // 12 hours
      }),
      new BroadcastUpdatePlugin()
    ],
  })
);

// Cache images for 1 day
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 1 * 24 * 60 * 60, // 1 day
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })      
    ],
  })
);

workbox.precaching.precacheAndRoute([
	{url: '/app/offline-v2.html', revision: null},
	{url: '/app/assets/offline.webp', revision: null},
	{url: '/app/assets/favicon.png', revision: null},
	{url: '/app/assets/favicon.svg', revision: null},
	{url: 'https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css', revision: null},
  ], {
	cleanUrls: false,
});

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
setCatchHandler(async ({request}) => {
  // The warmStrategyCache recipe is used to add the fallback assets ahead of
  // time to the runtime cache, and are served in the event of an error below.
  // Use `event`, `request`, and `url` to figure out how to respond, or
  // use request.destination to match requests for specific resource types.
  console.error("Couldn't reach ", request.destination, request.url);
  switch (request.destination) {
    case 'document':
      return matchPrecache("/app/offline-v2.html");

    case 'image':
      return matchPrecache("/app/assets/offline.webp");

    default:
      // If we don't have a fallback, return an error response.
      return Response.error();
  }
});

self.addEventListener('fetch', event => {
  console.log(`URL requested: ${event.request.url}`);
  event.respondWith(fetch(event.request));
});

self.addEventListener("install", (event) => {
    console.log("Service Worker Installed", APP_VERSION);
    self.skipWaiting();
});
  
self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated", APP_VERSION);
});
  
self.addEventListener("message", (event) => {
  console.log("sw.js - message ", event);
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
    console.log("Service Worker Skipped Waiting", APP_VERSION);
  }
});
  
//importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');
console.log("Service Worker Loaded!", APP_VERSION);
  