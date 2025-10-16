const version = 'v'
const staticCacheName = version + 'staticfiles';
const imageCacheName = 'images';
const pagesCacheName = 'pages';

const cacheList = [
  staticCacheName,
  imageCacheName,
  pagesCacheName
];

addEventListener('install', installEvent => {
  skipWaiting();
  installEvent.waitUntil(
    caches.open(staticCacheName)
    .then( staticCache => {
      // Nice to have
      staticCache.addAll([
        '/images/tt-tulip.svg'
      ]); // end addAll
      // Must have
      return staticCache.addAll([
        '/application.css',
        '/application.js',
        '/images/tt-logo-2025.svg',
        '/images/tt-logo-vertical.svg'
      ]); // end return addAll
    }) // end open then
  ); // end waitUntil
}); // end addEventListener

addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request;
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') { return }

  // Don't save google resources
  if (/^(http)(s)?(:\/\/)([a-z]+.)?(google|google-analytics)(\.com\/)/.test(request.url)) {
    return
  }
  // Don't save the mapbox api
  if (/(http)(s)?(:\/\/)(api\.mapbox\.com\/v\d)/.test(request.url)) {
    return
  }
  // Don't save admin stuff
  if (/\?p=(admin|actions\/debug)/.test(request.url)) {
    return
  }
  // Don't save facebook, google, or twitter resources
  if (/^(http)(s)?(:\/\/)([a-z]+.)?(facebook|google|google-analytics|googletagmanager|twitter)(\.com|\.net)(\/)/.test(request.url)) {
    return
  }
  // Don't save weird tracker pixel stuff
  if (/^(http)(s)?(:\/\/)(action\.)?(dstillery\.com)/.test(request.url)) {
    return
  }

  // Don't save PDFs
  var pdf = new RegExp('\\.pdf($|\\?)', 'i');
  var asset = new RegExp('/assets/');

  // Fixes a Chrome devtools issue
  // See: https://github.com/paulirish/caltrainschedule.io/pull/51/commits/82d03d9c4468681421321db571d978d6adea45a7
  if (request.destination == "document" && asset.test(request.url) && pdf.test(request.url)) {
    return
  }
  // When the user requests an HTML file
  if (request.headers.get('Accept').includes('text/html')) {
    fetchEvent.respondWith(
      // Fetch that page from the network
      fetch(request)
      .then( responseFromFetch => {
        // Put a copy in the cache
        const copy = responseFromFetch.clone();
        fetchEvent.waitUntil(
          caches.open(pagesCacheName)
          .then( pagesCache => {
            return pagesCache.put(request, copy);
          }) // end open then
        ); // end waitUntil
        return responseFromFetch;
      }) // end fetch then
      .catch( error => {
        // Otherwise look for a cached version of the page
        return caches.match(request)
        .then( responseFromCache => {
          if (responseFromCache) {
            return responseFromCache;
          } // end if
          // Otherwise show the fallback page
          return caches.match('/offline');
        }); // end match then and return
      }) // end fetch catch
    ); // end respondWith
    return; // Go no further
  } // end if

  // When the user requests an image
  if (request.headers.get('Accept').includes('image')) {
    fetchEvent.respondWith(
      // Look for a cached version of the image
      caches.match(request)
      .then( responseFromCache => {
        if (responseFromCache) {
          return responseFromCache;
        } // end if
        // Otherwise fetch the image from the network
        return fetch(request)
        .then( responseFromFetch => {
          // Put a copy in the cache
          const copy = responseFromFetch.clone();
          fetchEvent.waitUntil(
            caches.open(imageCacheName)
            .then( imageCache => {
              return imageCache.put(request, copy);
            }) // end open then
          ); // end waitUntil
          return responseFromFetch;
        }) // end fetch then
        .catch( error => {
          // Otherwise show a fallback image
          return caches.match('/fallback.svg');
        }); // end fetch catch and return
      }) // end match then
    ); // end respondWith
    return; // Go no further
  } // end if

  // For everything else...
  fetchEvent.respondWith(
    // Look for a cached version of the file
    caches.match(request)
    .then( responseFromCache => {
      if (responseFromCache) {
        return responseFromCache;
      } // end if
      // Otherwise fetch the file from the network
      return fetch(request);
    }) // end match then
  ); // end respondWith
}); // end addEventListener

addEventListener('activate', activateEvent => {
  activateEvent.waitUntil(
    caches.keys()
    .then( cacheNames => {
      return Promise.all(
        cacheNames.map( cacheName => {
          if (!cacheList.includes(cacheName)) {
            return caches.delete(cacheName);
          } // end if
        }) // end map
      ); // end return Promise.all
    }) // end keys then
    .then( () => {
      return clients.claim();
    }) // end then
  ); // end waitUntil
}); // end addEventListener

