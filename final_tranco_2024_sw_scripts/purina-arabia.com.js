/**
 * Cache-first network
 * ===================
 * Use this service worker to pre-cache content. The content you add to the
 * "cache-array" will be added immediately to the cache and service from the
 * cache whenever a page requests it. At the same time it will update the cache
 * with the version you have on the server. Configure your file array to include
 * all your site files, or a subset that you want to be served quickly.
 */

const CACHE = "cache-0";
//Detect Safari & chrome
let userAgentString = navigator.userAgent;
let safariAgent = false;
let chromeAgent = false
if(typeof userAgentString !== undefined){
  safariAgent = userAgentString.indexOf("Safari") > -1; 
  chromeAgent = userAgentString.indexOf("Chrome") > -1; 
}
  
// Discard Safari since it also matches Chrome 
if ((chromeAgent) && (safariAgent)) safariAgent = false;

self.addEventListener("install", function (event) {
  self.skipWaiting();

  event.waitUntil(caches.open(CACHE).then(function (cache) {
    // Pre cached file list comes from drupal.
    return cache.addAll([]);
  }));
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will look for the request in the cache and serve it
// from there first
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  /**
   * It's time to return the requested asset. For this, we first check the
   * cached files. If we find it, we deliver the cached version. If we
   * have not a cached version we return it from a regular request plus
   * we cache it for further requests.
   *
   * Keep in mind all requests (preached ones from preCacheFiles and a regular
   * request) will go trough this snippet.
   * It means every request will be cached, ergo and finally,
   * all the page assets.
   * */
  if(!safariAgent) {
    event.respondWith(
      fromCache(event.request).then(
        function (response) {
          // The response was found in the cache so we respond with it and
          // update the entry

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
          // The response was not found in the cache so we look for it on the
          // server
          return fetch(event.request)
            /**
             * Its time to add any non pre cached files to the cache.
             *
             * If This is an optional feature. You can just comment
             * out this snippet and the SW will only cache listed pages.
             *
             * Since we are implementing the "cache then network" strategy.
             * While you keep this snippet enabled, all pages will first use
             * the cached files then grab a fresh copy for further pages
             * */
            // .then(function (response) {
            //   // If request was success, add or update it in the cache
            //   event.waitUntil(updateCache(event.request, response.clone()));
            //
            //   return response;
            // })
            // .catch(function (error) {
            //   console.log("Network request failed and no cache." + error);
            // });

        }
      )
    );
  }
});

/**
 * Check if the requested asset is already on the cache.
 *
 * @param request
 * @returns {Promise<Response | undefined>}
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

/**
 * Stores a request on the cache for further requests.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    let uri = request.url.slice(self.origin.length);

    // Drupal adds cache query params and it make us fail when try
    // to compare lists since the uri name does not mach.
    if (uri.includes('?')) {
      uri = uri.split('?')[0];
    }

    const reservedURIs = [
      '/sw.js',
      '/sites/default/files/sw.js',
      '/sw/cached-uris',
      '/modules/custom/nppe_service_worker/js/register-sw.js'
    ];

    // If the uri is allowed, cache and return the cache obj.
    if (!reservedURIs.includes(uri) && !uri.startsWith('/admin')) {
      return cache.put(request, response);
    }

    return cache;
  });
}
