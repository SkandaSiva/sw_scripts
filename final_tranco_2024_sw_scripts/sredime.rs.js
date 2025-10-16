var domain = 'www.sredime.rs';
var baseURL = 'https://www.sredime.rs';
const version = '5.0.0';
const CACHE = "sredime-frontend";
const offlineFallbackPage = "offline.html";
const maxPages = 50; // Maximum number of pages to cache


// OLD
const precacheFiles = [
  offlineFallbackPage
];

/*
// NEW
const precacheFiles = [
  offlineFallbackPage,
  '/',
  '/lookbook',
  '/najbolji/svi-saloni',
  '/utisci/najbolji/svi-saloni',
  '/min/g=css?v=5.0.0',
  '/min/g=js?v=5.0.0',
  '/image/logo.png',
  '/image/logo-white-trans.gif',
  '/image/placeholder.png'
];
*/


self.addEventListener("install", function (event) {
  //console.log("[PWA Builder] Install Event processing");

  //console.log("[PWA Builder] Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      //console.log("[PWA Builder] Caching pages during install");
      return cache.addAll(precacheFiles);
    })
  );
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  //console.log("[PWA Builder] Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});


// OLD If any fetch fails, it will show the offline page.
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(function (error) {
      // The following validates that the request was for a navigation to a new document
      if (
        event.request.destination !== "document" ||
        event.request.mode !== "navigate"
      ) {
        return;
      }

      //console.error("[PWA Builder] Network request Failed. Serving offline page " + error);
      return caches.open(CACHE).then(function (cache) {
        return cache.match(offlineFallbackPage);
      });
    })
  );
});

/*
// NEW If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) { 
  
  if (event.request.method !== "GET") return;
  
  if ( event.request.url.indexOf( '/blog/' ) !== -1 ) return false;
  if ( event.request.url.indexOf( '/me/' ) !== -1 ) return false;
  if ( event.request.url.indexOf( '/cart/' ) !== -1 ) return false;
  if ( event.request.url.indexOf( '/checkout/' ) !== -1 ) return false;
  
  if ( event.request.url.indexOf( '/image/photo/' ) !== -1 ) return false;
  
  if ( event.request.url.indexOf( '/buker/' ) !== -1 ) return false;
  if ( event.request.url.indexOf( '/pozadina' ) !== -1 ) return false;
  
  if ( event.request.url.indexOf( '.googleadservices.' ) !== -1 ) return false;
  if ( event.request.url.indexOf( '.googletagmanager.' ) !== -1 ) return false;
  if ( event.request.url.indexOf( '/pagead/' ) !== -1 ) return false;
  if ( event.request.url.indexOf( '/maps' ) !== -1 ) return false;
  if ( event.request.url.indexOf( '.google-analytics.' ) !== -1 ) return false;
  if ( event.request.url.indexOf( '.facebook.' ) !== -1 ) return false;
  
  
 
  
  
  event.respondWith(
    fromCache(event.request).then(
      function (response) {
        // The response was found in the cache so we responde with it and update the entry

        // This is where we call the server to get the newest version of the
        // file to use the next time we show view
        event.waitUntil(
          fetch(event.request).then(function (response) {
            return updateCache(event.request, response);
          })
        );

        return response;
      },
      function () {
        // The response was not found in the cache so we look for it on the server
        return fetch(event.request)
          .then(function (response) {
            // If request was success, add or update it in the cache
            event.waitUntil(updateCache(event.request, response.clone()));

            return response;
          })
          .catch(function (error) {
			return caches.open(CACHE).then(function (cache) {
				return cache.match(offlineFallbackPage);
			});
			
			
			
          });
      }
    )
  );
});
*/

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
	try {
	  return cache.put(request, response);
	} catch (e) {
	  trimCache(maxPages);
	  return false;
	}

  });
}

function trimCache(maxItems) {
    caches.open(CACHE)
    .then( cache => {
        cache.keys()
        .then(keys => {
            if (keys.length > maxItems) {
                cache.delete(keys[0])
                .then( () => {
                    trimCache(maxItems)
                });
            }
        });
    });
}


// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function () {
  const offlinePageRequest = new Request(offlineFallbackPage);

  return fetch(offlineFallbackPage).then(function (response) {
    return caches.open(CACHE).then(function (cache) {
      //console.log("[PWA Builder] Offline page updated from refreshOffline event: " + response.url);
      return cache.put(offlinePageRequest, response);
    });
  });
});
