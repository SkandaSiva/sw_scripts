// Caches
/* eslint-disable */

const version = self.location.search.split('v=')[1] || '1.1.0'
const CURRENT_CACHES = {
  svg: `svg-cache-v${version}`,
  font: `font-cache-v${version}`,
  css: `css-cache-v${version}`,
  js: `js-cache-v${version}`,
  api: `api-cache-v${version}`
}

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
     return Promise.all(
        cacheNames.map(cacheName => {
            if ([version].indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          }
          )
      )
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(async function () {
    const cachedResponse = await caches.match(event.request)
    if (cachedResponse) {
      return cachedResponse
    } else {
      return await fetchAndCache(event.request)
    }
  }())
})

function fetchAndCache(request) {
  return fetch(request)
    .then(response => {
      if (!response.ok) {
        return response
      }
      const url = new URL(request.url)
      const isModeNoCache = url.search.indexOf('mode=nocache') === -1
      const isModeCache = url.search.indexOf("mode=cache") !== -1

      if (response.status < 400 && response.type === 'basic' && isModeNoCache){
        const contentType = response.headers.get('content-type')
        let cur_cache
        if (contentType && contentType.indexOf('application/javascript') >= 0) {
          cur_cache = CURRENT_CACHES.js
        } else if (contentType && contentType.indexOf('text/css') >= 0) {
          cur_cache = CURRENT_CACHES.css
        }
        else if (contentType && contentType.indexOf('font') >= 0) {
          cur_cache = CURRENT_CACHES.font
        } else
        if (contentType && contentType.indexOf('svg+xml') >= 0) {
          cur_cache = CURRENT_CACHES.svg
        }
        if (contentType && contentType.indexOf('application/json') >= 0 && isModeCache) {
          cur_cache = CURRENT_CACHES.api
        }
        if (cur_cache) {
          return caches.open(cur_cache).then(cache => {
            cache.put(request, response.clone())
            return response
          })
        }
      }
      return response
    })
    .catch(error => {
      throw error
    })
}
