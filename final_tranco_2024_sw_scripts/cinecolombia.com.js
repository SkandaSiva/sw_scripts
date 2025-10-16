importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.core.setCacheNameDetails({ prefix: 'cineco-cms' });
self.__precacheManifest = [].concat([
  {
    "revision": "v2",
    "url": "/manifest.json"
  }
]);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

self.addEventListener('message', (event) => {
  if (
    (event.data && event.data.action == 'SKIP_WAITING') ||
    (event.data && event.data.type === 'SKIP_WAITING')
  ) {
    self.skipWaiting()
  }
});
