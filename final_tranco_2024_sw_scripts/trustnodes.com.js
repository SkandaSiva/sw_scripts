const urlsToCache = [
  "/BitcoinLatestArticles.80ace1aa.js",
  "/CheckoutPage.c7518b45.js",
  "/CommentSection.0f1f6401.js",
  "/EthereumLatestArticles.99cb70f7.js",
  "/HotNews.fb13ac2c.js",
  "/MintArticle.bb9c7daf.js",
  "/News.fa68edf7.js",
  "/RelatedArticles.65bf9014.css",
  "/RelatedArticles.ebd8f389.js",
  "/RelatedArticlesTitles.d5b5aa20.js",
  "/VideoPlayer.9ab68c12.js",
  "/bitcoin-logo.2773d977.webp",
  "/darkmode-logo.c5861879.webp",
  "/ethereum-logo.ea0c01a2.webp",
  "/index.43cd903b.css",
  "/index.7f5b76a4.js",
  "/logo.webp",
  "/plan.be334f04.webp",
  "/service.js",
  "/trustnodes-app-icon-1.webp",
  "/trustnodes-icon.e849b24a.webp"
];
const CACHE_NAME = 'v8_cache';

// The install event is fired when the service worker starts up.
// All service worker code must be inside an event callback.
self.addEventListener('install', function(event) { 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async function(cache) {
        //console.log(urlsToCache);

        // Filter out invalid URLs (not HTTP/HTTPS)
        const validUrls = urlsToCache.filter(url => url.startsWith('https://'));

        // Map each URL to a caching operation
        const cachePromises = validUrls.map(url => 
          cache.add(url).catch(() => {
            //console.warn(`Failed to cache ${url} on first attempt, retrying...`);
            return retryCache(url, cache, 1);
          })
        );

        // Wait for all caching operations to complete
        return Promise.all(cachePromises);
      })
      .catch(error => {
        //console.error(`Install failed: ${error}`);
      })
  );
  self.skipWaiting();
});

// Function to retry caching with a maximum of 3 attempts
function retryCache(url, cache, attempt) {
  return cache.add(url).catch(err => {
    //console.warn(`Error on attempt ${attempt} to cache ${url}:`, err.message);
    if (attempt < 3) {
     // console.warn(`Retrying to cache ${url}, attempt ${attempt + 1}`);
      return retryCache(url, cache, attempt + 1);
    } else {
      //console.error(`Failed to cache ${url} after ${attempt} attempts:`, err.message);
    }
  });
}

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});


const MAX_CACHE_ITEMS = 50; // Adjust this number based on your needs

async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    try {
      await cache.delete(keys[0]);
      await limitCacheSize(cacheName, maxItems);
    } catch (error) {
      //console.error(`Error deleting cache item ${keys[0]} in ${cacheName}:`, error.message);
    }
  }
}

self.addEventListener('fetch', function(event) {
  // Ignore non-GET requests and requests with non-HTTP/HTTPS schemes
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // Check if the request is for your own site
  if (url.origin === location.origin) {

    if (urlsToCache.includes(new URL(event.request.url).pathname)) {
      event.respondWith(
        caches.match(event.request)
          .then(function(response) {
            if (response) {
              return response;
            }

            return fetch(event.request)
              .then(function(networkResponse) {
                // Check if the response is valid before caching
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                  return networkResponse;
                }

                var clonedResponse = networkResponse.clone();

                // Inside your fetch event handler, after putting an item into the cache
                caches.open(CACHE_NAME).then(function(cache) {
                  cache.put(event.request, clonedResponse).catch(function(error) {
                    //console.error('Error caching new network response:', error);
                  });
                  limitCacheSize(CACHE_NAME, MAX_CACHE_ITEMS); // Limit the cache size
                });
                return networkResponse;
              });
          })
          .catch(function(error) {
            //console.error('Error matching cache:', error);
          })
      );
    } else {
      event.respondWith(
        fetch(event.request)
          .then(function(networkResponse) {
            var clonedResponse = networkResponse.clone();

            // Inside your fetch event handler, after putting an item into the cache
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clonedResponse).catch(function(error) {
              //console.error(`Error caching response for ${event.request.url}:`, error.message);
              });
              limitCacheSize(CACHE_NAME, MAX_CACHE_ITEMS); // Limit the cache size
            });

            return networkResponse;
          })
          .catch(function(error) {
            //console.error(`Error fetching and caching new data for ${event.request.url}:`, error.message);
            return caches.match(event.request);
          })
      );
    }
  }
});

self.addEventListener('push', function(event) {

  const payload = JSON.parse(event.data.text());
  const title = payload.title || 'New notification';
  const options = {
    body: payload.body,
    icon: '/images/icon.png',
    badge: '/images/badge.png',
    data: {
      url: payload.url,
    },
    actions: [
      {action: 'like', title: 'Like'},
      {action: 'reply', title: 'Reply'}
    ]
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

