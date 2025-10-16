"use strict"; // ES6

// Cache identifier: change to invalidate previous caches
const CACHE = 'q23-005';

// Assets which must be cached for the service worker to be considered successfully installed
const CACHE_MUST = [
  '/offline/',
  '/',
  '/_q23tf/rlr.woff2',
  '/_q23tf/rl7.woff2',
  '/_q23t/sh-hover.svg',
  '/_q23t/icons/kinds/article.svg',
  '/_q23t/icons/kinds/checkin.svg',
  '/_q23t/icons/kinds/note.svg',
  '/_q23t/icons/kinds/reply.svg',
  '/_q23t/icons/kinds/repost.svg',
  '/_q23t/icons/kinds/rsvp.svg',
  '/_q23t/icons/kinds/video.svg',
  '/_q23t/icons/kinds/collection.svg',
  '/_q23t/icons/kinds/comic.svg',
  '/_q23t/icons/kinds/review.svg',
];

// Assets which should never be written to the cache
const CACHE_NEVER = [
  /^\/wp-json\//,
  /^\/_q23j\//,
  /^\/wp-admin\//,
  /^\/wp-login\.php/,
  /^\/qadmin/,
  /^\/sw\.js/,
  /\/feed\//,
  /^\/xmlrpc\.php/,
];

// On install, begin precaching content
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(CACHE_MUST);
    })
  );
});

// On activation, delete non-current cache collections
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => (cacheName != CACHE)).map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Returns a Response containing an "offline" SVG
function offlineImage() {
  return new Response(
    '<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>',
    { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' } }
  );
}

// Intercept fetch requests
self.addEventListener('fetch', function(event) {
  let request = event.request;
  let url = new URL(request.url);
  let requestForImage = (!!request.headers.get('Accept').match(/^image\//) || !!url.pathname.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|webp)$/));
  // console.info(`Service Worker - ${url} - requested via service worker.`);

  // Ignore insecure requests
  if (url.protocol !== 'https:'){
    // console.info(`Service Worker - ${url} - not HTTPS, not interrupting fetch.`);
    return;
  }

  // Ignore offsite requests
  if (!url.hostname.match(/\.?danq\.me$/)){
    // console.info(`Service Worker - ${url} - not danq.me, not interrupting fetch.`);
    return;
  }

  // Ignore dempotent requests (non-GET)
  if (request.method !== 'GET'){
    // console.info(`Service Worker - ${url} - not GET, not interrupting fetch.`);
    return;
  }

  // Ignore some special requests
  // Result: NETWORK only
  if(CACHE_NEVER.filter(path => !!url.pathname.match(path)).length > 0){
    // console.info(`Service Worker - ${url} - in CACHE_NEVER list, not interrupting fetch.`);
    return;
  }

  // When navigating, attempt to serve from the network but fall back to the cache:
  if (event.request.mode === 'navigate') {
    // console.info(`Service Worker - ${url} - attempting network-else-cache strategy.`);
    return fetch(request).then((networkResponse) => {
      // console.info(`Service Worker - ${url} - fetched from network; updating cache.`);
      caches.open(CACHE).then((cache)=>cache.put(request, networkResponse.clone()));
      return networkResponse;
    }).catch(()=>{
      return caches.open(CACHE).then((cache)=>cache.match(url) || (requestForImage ? offlineImage() : cache.match('/offline/')));
    });
  }

  // For other requests - attempt to serve from cache and update in background
  // console.info(`Service Worker - ${url} - attempting cache-and-refresh strategy.`);
  event.respondWith(caches.open(CACHE).then((cache) => {
    return cache.match(request).then((cachedResponse) => {
      // console.info(`Service Worker - ${url} - found in cache; serving cached version.`);
      const fetchedResponse = fetch(request).then((networkResponse) => {
        // console.info(`Service Worker - ${url} - fetched from network; updating cache.`);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }).catch(()=>{
        return (requestForImage ? offlineImage() : cache.match('/offline/'));
      });;

      return cachedResponse || fetchedResponse;
    });
  }));
});
