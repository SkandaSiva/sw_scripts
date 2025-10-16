//	I installationsfasen (event install) åbner vi en cache med navnet 'cache-v1' og tilføjer de ønskede ressourcer til cachen.
//	I aktiveringsfasen (event activate) rydder vi gamle cacher ved at sammenligne cache-navnene og slette eventuelle cacher, der ikke matcher det aktuelle navn 'cache-v1'.
//	I opdateringsfasen (event fetch) forsøger vi stadig at hente ressourcer fra cachen, mens vi også henter de nyeste ressourcer fra nettet og opdaterer cachen med dem.
//	Denne kode giver mulighed for at opdatere din servicearbejder og cache, når du ruller en ny version af din PWA ud, samtidig med at den fjerner gamle cacher, der ikke længere er i brug. Vær opmærksom på, at du skal ændre cache-navnet (CACHE_NAME) hver gang du opdaterer din servicearbejder eller dine cache-resurser.

const PRECACHE = 'precache-v15';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
'/include/jquery-and-javascripts.js?time=26',
'/include/autocomplete.js?time=1',
'/stylecompressed.css?time=13',
'/pwa/offline.asp',
'/pwa/offline.jpg'
];

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
  //const currentCaches = [PRECACHE, RUNTIME];
  const currentCaches = [PRECACHE];
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
  if (event.request.url.startsWith(self.location.origin)) {
//    event.respondWith(
//      caches.match(event.request).then(cachedResponse => {
//        if (cachedResponse) {
//          return cachedResponse;
//        }

//        return caches.open(RUNTIME).then(cache => {
//          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
//            return cache.put(event.request, response.clone()).then(() => {
//              return response;
//            });
//          });
//        });
//      })
//    );
	event.respondWith(
	  caches.open(RUNTIME).then(cache => {
		return fetch(event.request).then(response => {
		  // Check if the fetched response is valid (e.g., not an error response).
		  if (response && response.status === 200) {
			// Put a copy of the response in the runtime cache.
			cache.put(event.request, response.clone());
		  }
		  return response;
		}).catch(() => {
		  // If the network request fails, serve a fallback response here if needed.
		});
	  })
	);

  }
});