importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();
workbox.core.clientsClaim();

const FALLBACK_URL_HTML = '{{OFFLINE_PAGE_URL}}';
const ENABLE_OFFLINE_PAGE = '';

// self.addEventListener('install', function (event) {
// });

// self.addEventListener('activate', event => {
// });

workbox.precaching.precacheAndRoute([]);

// NOT CACHED
workbox.routing.registerRoute(
  ({url, event}) => {
      return event.request.method === 'GET' && ['document', ''].indexOf(event.request.destination) !== -1;
  },
  new workbox.strategies.NetworkOnly()
);

// MANIFEST, IMAGE, STYLE, SCRIPT CACHED
workbox.routing.registerRoute(
  ({url, event}) => {
      return event.request.method === 'GET' &&
        ['manifest', 'image', 'style', 'script'].indexOf(event.request.destination) !== -1;
  },
  new workbox.strategies.CacheFirst()
);

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
workbox.routing.setCatchHandler(({event}) => {
    // The FALLBACK_URL entries must be added to the cache ahead of time, either via runtime
    // or precaching.
    // If they are precached, then call workbox.precaching.getCacheKeyForURL(FALLBACK_URL)
    // to get the correct cache key to pass in to caches.match().

    // Use event, request, and url to figure out how to respond.
    // One approach would be to use request.destination, see
    // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c

    switch (event.request.destination) {
        case 'document':
            return ENABLE_OFFLINE_PAGE
              ? caches.match(workbox.precaching.getCacheKeyForURL(FALLBACK_URL_HTML))
              : Response.error();
            break;

        default:
            // If we don't have a fallback, just return an error response.
            return Response.error();
    }
});
