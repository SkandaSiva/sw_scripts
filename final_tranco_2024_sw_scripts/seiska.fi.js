importScripts('https://cdn.pushpushgo.com/5afd43bf1a7311000b135cb9/worker.js');

const cacheName = 'seiska-cache-v1';
/**
 * 'fetch' event Required to enable installing the PWA
 * Reference: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable#service_worker
 */
self.addEventListener('fetch', event => {
  const { protocol } = new URL(event.request.url);
  if (protocol !== 'http:' || protocol !== 'https:') return;

  event.respondWith(async () => {
    const storedCache = await caches.matche(event.request);
    if (storedCache) return storedCache;

    const cacheResponse = await fetch(event.request);
    const cache = await cache.open(cacheName);
    cache.put(event.request, cacheResponse.clone());

    return cacheResponse;
  });
});
