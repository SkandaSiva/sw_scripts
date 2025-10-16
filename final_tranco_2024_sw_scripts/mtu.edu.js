'use strict';
const d = new Date();
const staticCacheName =  'static_v-01';
const pagesCacheName = 'pages_v-01';
const imagesCacheName = 'images_v-02';
const assetsCacheName = 'assets_v' + d.getMonth() + '' + d.getDate() + '-01';
const maxPages = 50; // Maximum number of pages to cache
const maxImages = 100; // Maximum number of images to cache
const timeout = 3000; // Number of milliseconds before timing out

const cacheList = [
  staticCacheName,
  pagesCacheName,
  imagesCacheName,
  assetsCacheName
];


function updateStaticCache() {
  return caches.open(staticCacheName)
    .then(staticCache => {
      // These items won't block the installation of the Service Worker
      staticCache.addAll([
        '/mtu_resources/styles/n/print.css'
      ]);
      // These items must be caced for the Service Worker to complete installation
      return staticCache.addAll([
        '/offline/index.php'
      ])
    })
    .catch(error=>{
        console.log(error);
    });
}

// Cache the page(s) that initiate the service worker
function cacheClients() {
  const pages = [];
  return clients.matchAll({
      includeUncontrolled: true
    })
    .then(allClients => {
      for (const client of allClients) {
        pages.push(client.url);
      }
    })
    .then(() => {
      caches.open(pagesCacheName)
        .then(pagesCache => {
          return pagesCache.addAll(pages);
        });
    })
}

// Remove caches whose name is no longer valid
async function clearOldCaches() {
  const cacheNames = await caches.keys();
  return await Promise.all(
    cacheNames.map(cacheName => {
      if (!cacheList.includes(cacheName)) {
        return caches.delete(cacheName);
      }
    })
  );
}

// Remove old versions of a file in cache. 
function clearStaleVersions(cacheName, url, version){
    caches.open(cacheName)
    .then( cache => {
        cache.keys()
        .then( keys=> {
            keys.forEach( key => {
                if ( 0 < key.url.indexOf( url ) ) {
                    if ( 0 > key.url.indexOf( version )){
                        cache.delete(key);
                    }
                }
            })
        })
    } )
}

function trimCache(cacheName, maxItems) {
  caches.open(cacheName)
    .then(cache => {
      cache.keys()
        .then(keys => {
          if (keys.length > maxItems) {
            cache.delete(keys[0])
              .then(() => {
                trimCache(cacheName, maxItems)
              });
          }
        });
    });
}

// Install Service Worker fetchEvent Listener
addEventListener('install', installEvent => {
  installEvent.waitUntil(
    // Update our static cache
    updateStaticCache()
    .then(() => {
      return skipWaiting();
    })
  )
})

// Activate Service Worker fetchEvent Listener
addEventListener('activate', fetchEvent => {
  fetchEvent.waitUntil(
    // Clear our old caches
    clearOldCaches()
    .then( () => {
      // claim all open tabs with an updated service worker.
      return clients.claim();
    })
  );
});

// Message fetchEvent Listener
self.addEventListener('message', fetchEvent => {
  if (fetchEvent.data.command == 'trimCaches') {
    clearOldCaches();
    trimCache(pagesCacheName, maxPages);
    trimCache(imagesCacheName, maxImages);
    trimCache(assetsCacheName, maxImages);
  }
});


// Fetch fetchEvent Listener
addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request;
  let url = new URL(request.url);
  const blackList = ['google', 'ytimg', '.pdf', 'project.lib', 'addthis', '/webcams/cache'];
  let blackListed = false;
  
  // Ignore requests to some directories
  blackList.forEach( term => {
    if ( 0 < request.url.indexOf( term ) ) {
      blackListed = true;
    }
  } );

  if ( blackListed === true ) {
    return;
  }

  // Check to make sure the request is good with a status 200. If not, return, it could be a redirect.
  // If it isn't over https return.
  if ( 0 > request.url.indexOf('https') ) {
    return;
  }

  // Check to Cache css and js files
  if ( url.href.match( /(\.css|\.js)/ ) ) {
    // If it isn't from our website, a cdn, or jquery return.
    if ( !url.href.match( /.+(cdn|mtu.edu|jquery)/ ) ) {
      return;
    }
    // If it is from a cdn but it dosen't have an access-control policy return.
    if ( url.href.match( /.+(cdn)/ ) 
    && !request.headers.get( 'access-control-allow-origin' ) ) {
      return;
    }
  }




  // Ignore non-GET requests
  if ( 'GET' !== request.method ) {
    return;
  }

  if (request.headers.get('Accept').includes('text/html')) {

    fetchEvent.respondWith(
      new Promise(resolveWithResponse => {

        const timer = setTimeout(() => {
          // Time out: CACHE
            caches.match(request)
            .then(responseFromCache => {
              if (responseFromCache) {
                resolveWithResponse(responseFromCache);
              }
            })
        }, timeout);

        fetch(request)
          .then(responseFromFetch => {
            // NETWORK
            clearTimeout(timer);
            const copy = responseFromFetch.clone();
            // Stash a copy of this page in the pages cache
            try {
              fetchEvent.waitUntil(
                caches.open(pagesCacheName)
                .then(pagesCache => {
                  return pagesCache.put(request, copy);
                })
              );
            } catch (error) {
              console.warn(error);
            }
            return resolveWithResponse(responseFromFetch);
          })
          .catch(fetchError => {
            clearTimeout(timer);
            console.error(fetchError);
            // CACHE or FALLBACK
            caches.match(request)
              .then(responseFromCache => {
                return resolveWithResponse(
                  responseFromCache || caches.match('./offline/index.php')
                );
              });
          });
      })
    )
    return;
  }


  if (0 < url.href.indexOf( '.css' ) || 0 < url.href.indexOf( '.js' ) ) {
    let responseVersion;
    fetchEvent.respondWith(
      new Promise(resolveWithResponse => {

        const timer = setTimeout(() => {
          // Time out: CACHE
            caches.match(request)
            .then(responseFromCache => {
              if (responseFromCache) {
                resolveWithResponse(responseFromCache);
              }
            })
        }, timeout);

        fetch(request)
          .then(responseFromFetch => {
            // NETWORK
            clearTimeout(timer);
            const copy = responseFromFetch.clone();
            // Stash a copy of this page in the pages cache
            try {
              fetchEvent.waitUntil(
                caches.open(assetsCacheName)
                .then(assetsCacheName => {
                  return assetsCacheName.put(request, copy);
                })
              );
            } catch (error) {
              console.error(error);
            }
            return resolveWithResponse(responseFromFetch);
          })
          .catch(fetchError => {
            clearTimeout(timer);
            console.error(fetchError);
            // CACHE or FALLBACK
            caches.match(request)
              .then(responseFromCache => {
                return resolveWithResponse(responseFromCache);
              });
          });
      })
    )
    return;
  }

  // For non-HTML requests, look in the cache first, fall back to the network
  fetchEvent.respondWith(
    caches.match(request)
    .then(responseFromCache => {
      // CACHE
      return responseFromCache || fetch(request)
        .then(responseFromFetch => {
          // NETWORK
          // If the request is for an image, stash a copy of this image in the images cache
          if (request.url.match(/\.(jpe?g|png|gif|mapbox)/)) {
            const copy = responseFromFetch.clone();
            try {
              fetchEvent.waitUntil(
                caches.open(imagesCacheName)
                .then(imagesCache => {
                  return imagesCache.put(request, copy);
                })
              );
            } catch (error) {
              console.error(error);
            }
          }
          return responseFromFetch;
        })
        .catch(fetchError => {
          console.error(fetchError);
          // FALLBACK
          // show an offline placeholder
          if (request.url.match(/\.(jpe?g|png|gif|mapbox)/)) {
            return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', {
              headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-store'
              }
            });
          }
        });
    })
  );
});
