importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.1.0/workbox-sw.js');
 
const offlinePage = '/offline/offline.html';
const offlineImage = '/offline/header.jpg';

/**
* Kindly add the URL that needs to be precached in the below section.
e.g.:
workbox.precaching.precache([
 offlinePage,
 offlineImage,
 "https://www.example.com"
]);
*/

workbox.precaching.precacheAndRoute([
  offlinePage,
  offlineImage
]);
 
/**
* Enable navigation preload.
*/
workbox.navigationPreload.enable();

/**
* Enable “Offline” tracking in Google Analytics.
*
* Note: This feature only works with Google Analytics. 
*/
workbox.googleAnalytics.initialize();
 
/**
 * Basic caching for HTML pages, CSS+JS (caching max. 1 week).
 */
/*
workbox.routing.registerRoute(
  /\.(?:html|htm|js|css)$/,
  new workbox.strategies.NetworkFirst({
    networkTimeoutSeconds: 5,
    cacheName: 'html_css_js',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache files for a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
        // Only cache 30 files.
        maxEntries: 30,
      }),
    ],
  })
);
*/
 
/**
 * Basic caching for JSON data (caching max. 1 day).
 */
/*
workbox.routing.registerRoute(
  /\.(?:json)$/,
  new workbox.strategies.NetworkFirst({
    networkTimeoutSeconds: 60,
    cacheName: 'json',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache pages for a week
        maxAgeSeconds: 24 * 60 * 60,
        // Only cache 10 files.
        maxEntries: 10,
      }),
    ],
  })
);
*/
 
/**
 * Basic caching for max. 60 images (caching max. 30 days).
 */
/*
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache images for 30 days
        maxAgeSeconds: 30 * 24 * 60 * 60,
        // Only cache 60 images.
        maxEntries: 60,
      }),
    ],
  })
);
*/
 
/**
 * Use a stale-while-revalidate strategy for all other requests.
 */
/*
workbox.routing.setDefaultHandler(
  new workbox.strategies.StaleWhileRevalidate()
);
*/

/*
* Fallback to offline HTML page when a navigation request fails.
*/
const htmlHandler = new workbox.strategies.NetworkOnly();
// A NavigationRoute matches navigation requests in the browser, i.e. requests for HTML.
const navigationRoute = new workbox.routing.NavigationRoute(({event}) => {
  const request = event.request;
  return htmlHandler.handle({event, request}).catch((error) => caches.match(offlinePage, {
    ignoreSearch: true
  }));
});
workbox.routing.registerRoute(navigationRoute);
