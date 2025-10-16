// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v10.5';
const RUNTIME = 'runtime-v10.5';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin) 
    && !event.request.url.includes("/ajax-")
    && !event.request.url.includes("/bo/") 
    && !event.request.url.includes("/colloques/")
    && !event.request.url.includes("/revue/")
    && !event.request.url.includes("/lht/")
    && !event.request.url.includes("/actualites/")
    && !event.request.url.includes("/rss/")
    && !event.request.url.includes("/sitemaps/")
    && !event.request.url.includes("/sitemap.xml")
    && !event.request.url.includes("/atelier/")
    && !event.request.url.includes("/mon-compte/")
    && !event.request.url.includes("/recherche.html")
    && !event.request.url.includes("/archives/")
    && !event.request.url.includes("/tendances/")
    && !event.request.url.includes("/new_atelier/")
    && !event.request.url.includes("/mediawiki/")
    && !event.request.url.includes("/atelier/")) {
    event.respondWith(async function() {
        try {
          return await fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return caches.open(RUNTIME).then(cache => {
                return cache.put(event.request, response.clone()).then(() => {
                  return response;
                });
            });
          });

        } catch (err) {
          return caches.match(event.request);
        }
    }());
  }
});