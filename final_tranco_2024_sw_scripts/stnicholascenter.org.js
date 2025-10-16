// /* eslint-env serviceworker */
/*
    */
const version = 'v.2024-11-07T21:57:12-05:00'

const staticCacheName = version + 'staticfiles'
const imageCacheName = 'images'
const pagesCacheName = 'pages'

const cacheList = [
  staticCacheName,
  imageCacheName,
  pagesCacheName
]

addEventListener('install', installEvent => {
  skipWaiting()
  installEvent.waitUntil(
    caches.open(staticCacheName)
      .then(staticCache => {
      // Nice to have
        staticCache.addAll([
          'assets/images/sn-header-bg.png?auto=format&fit=max&h=300',
          'assets/images/sn-header.png?auto=format&fit=max&h=300',
          'assets/images/sn-header-bg.png?auto=format&fit=max&h=150',
          'assets/images/sprite.svg',
          'nav/pages.json',
          'nav/events.json',
          'nav/gallery.json',
          'nav/gazetteer.json'

        ]) // end addAll
        // Must have
        return staticCache.addAll([
          '/assets/css/stylesheet.2024-11-07T21:57:12-05:00.css',
          '/assets/images/logo-responsive.svg',
          '/glossary/ajax.2024-11-07T21:57:12-05:00.json'
        ]).then((error) => {
          console.log(error)
        })// end return addAll
      }) // end open then
  ) // end waitUntil
}) // end addEventListener
addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request
  const requestURL = new URL(request.url)
  // Don't save secure files
  if (/(secure-files|secured-images|publicity-materials|traveling-exhibit\/artifacts)/.test(request.url)) {
    return
  }
  if (/(\/how-to-celebrate\/resources\/stories-poems\/stories\/intro)/.test(request.url)) {
    return
  }

  // Don't save search
  if (/^\/search(\/|$)/.test(requestURL.pathname)) {
    return
  }

  // Don't save admin stuff
  if (/\?p=admin/.test(request.url)) {
    return
  }
  // Don't save admin stuff
  if (/checkAdmin\.js/.test(request.url) || /cpresources|actions|admin/.test(request.url)) {
    return
  }
  // Don't save facebook, google, or twitter resources
  if (/^(http)(s)?(:\/\/)([a-z]+.)?(bugsnag|cloudflareinsights|facebook|google|google-analytics|googletagmanager|gstatic|twitter)(\.com|\.net)(\/)/.test(request.url)) {
    return
  }
  // Don't save PDFs
  const mp = new RegExp('\\.mp[34]{1,1}($|\\?)', 'i')
  const pdf = new RegExp('\\.pdf($|\\?)', 'i')
  const asset = new RegExp('/assets/')
  if (request.destination === 'document' && asset.test(request.url) && pdf.test(request.url)) {
    return
  }
  // Don't cache MP3/4 files. It confuses Safari for some reason.
  if (asset.test(request.url) && mp.test(request.url)) {
    return
  }

  // When the user requests an image
  if (request.headers.get('Accept').includes('image') && request.headers.get('Accept').includes('html') === false) {
    if (request.referrer &&
      new URL(request.referrer).hostname === new URL(request.url).hostname) {
      fetchEvent.respondWith(
        // Look for a cached version of the image
        caches.match(request)
          .then(responseFromCache => {
            if (responseFromCache) {
              return responseFromCache
            } // end if
            // Otherwise fetch the image from the network
            return fetch(request)
              .then(responseFromFetch => {
                // Put a copy in the cache
                const copy = responseFromFetch.clone()
                fetchEvent.waitUntil(
                  caches.open(imageCacheName)
                    .then(imageCache => {
                      return imageCache.put(request, copy)
                    }) // end open then
                ) // end waitUntil
                return responseFromFetch
              }) // end fetch then
              .catch(() => {
                // Otherwise show a fallback image
                // return caches.match('/fallback.svg');
              }) // end fetch catch and return
          }) // end match then
      ) // end respondWith
      return // Go no further
    } // end if
    return
  }

  // When the user requests an HTML file
  if (request.headers.get('Accept').includes('text/html')) {
    fetchEvent.respondWith(
      // Fetch that page from the network
      fetch(request)
        .then(responseFromFetch => {
        // Put a copy in the cache
          const copy = responseFromFetch.clone()
          fetchEvent.waitUntil(
            caches.open(pagesCacheName)
              .then(pagesCache => {
                return pagesCache.put(request, copy)
              }) // end open then
          ) // end waitUntil
          return responseFromFetch
        }) // end fetch then
        .catch(() => {
        // Otherwise look for a cached version of the page
          return caches.match(request)
            .then(responseFromCache => {
              if (responseFromCache) {
                return responseFromCache
              } // end if
              // Otherwise show the fallback page
              // return caches.match('/offline');
            })
        })
    )
    return
  }

  // For everything else...
  fetchEvent.respondWith(
    // Look for a cached version of the file
    caches.match(request)
      .then(responseFromCache => {
        if (responseFromCache) {
          return responseFromCache
        } // end if
        // Otherwise fetch the file from the network
        return fetch(request).catch(error => console.log(error))
      }) // end match then
  ) // end respondWith
}) // end addEventListener

addEventListener('activate', activateEvent => {
  activateEvent.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheList.includes(cacheName)) {
              return caches.delete(cacheName)
            } // end if
          }) // end map
        ) // end return Promise.all
      }) // end keys then
      .then(() => {
        return clients.claim()
      }) // end then
  ) // end waitUntil
}) // end addEventListener
