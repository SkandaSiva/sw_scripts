importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const FALLBACK_HTML_URL = '/offline.php?v=2';
const GROUNDLISTE_HTML_URL = '/index.php?s=groundliste';
const CORONA_HTML_URL = '/corona-uebersicht.html';

//workbox.skipWaiting();
//workbox.clientsClaim();


// Die Offline-Seite Precachen
workbox.precaching.precacheAndRoute([
      {url: FALLBACK_HTML_URL, revision: null}/*,
      {url: GROUNDLISTE_HTML_URL, revision: '9'},
      {url: CORONA_HTML_URL, revision: '9'}*/
]);

//workbox.precaching.precacheAndRoute([{"revision":"0ce8580d37a0e6b9f6ac4220a6b39187","url":"offline.php"}]);


// cache name
workbox.core.setCacheNameDetails({
    prefix: 'europlan',
    precache: 'precache',
    runtime: 'runtime',
  });
  
// Default ist NetworkOnly
workbox.routing.setDefaultHandler(
   new workbox.strategies.NetworkOnly()
);  
  
// Fallback fuer alle Dokumente
workbox.routing.setCatchHandler(({event}) => {
      switch (event.request.destination) {
        case 'document':
          return caches.match(FALLBACK_HTML_URL);
        break;
      default:
        return Response.error();
  }
});  
  
// runtime cache
// 1. stylesheet
/*workbox.routing.registerRoute(
    new RegExp('\.css$'),
    new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
    new RegExp('\.js'),
    new workbox.strategies.CacheFirst()
);
*/
// 2. images
workbox.routing.registerRoute(
    new RegExp('\.css*'),
   new workbox.strategies.StaleWhileRevalidate()
);
workbox.routing.registerRoute(
    new RegExp('\.js*'),
   new workbox.strategies.StaleWhileRevalidate()
);
workbox.routing.registerRoute(
    new RegExp('\.woff*'),
   new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
    new RegExp('/img/flags/.*\\.png'),
   new workbox.strategies.CacheFirst()
);
/*
workbox.routing.registerRoute(
    new RegExp('\.(png|gif|svg|jpg|jpeg|JPG)$'),
   new workbox.strategies.StaleWhileRevalidate()
);*/
// 3. cache news articles result

workbox.routing.registerRoute(
    '/index.php',
    new workbox.strategies.NetworkFirst()
);
workbox.routing.registerRoute(
    '/',
    new workbox.strategies.NetworkFirst()
);
workbox.routing.registerRoute(
    '',
    new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
    GROUNDLISTE_HTML_URL,
    new workbox.strategies.NetworkFirst()
);
workbox.routing.registerRoute(
    CORONA_HTML_URL,
    new workbox.strategies.NetworkFirst()
);
/*workbox.routing.registerRoute(
    new RegExp('https://www.europlan-online.de'),
    new workbox.strategies.StaleWhileRevalidate()
);*/
  

