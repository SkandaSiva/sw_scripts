/*
* Safari on iOS doesn't support registration.update()
* https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
*
* So once you update this file then add a version number to the filename (-v2) and
* unregister `service-workers.js` in the `register-service-worker.js` file.
*
* This is far from ideal but at least we know for sure that the service-worker is also
* being updated in Safari on iOS.
*/
importScripts(
  '/service-workers/utils/get-video-from-cache-or-network.js',
  '/service-workers/utils/claim-clients-and-remove-outdated-caches.js',
  '/service-workers/utils/video-worker-utils.js',
  '/service-workers/exponea/service-worker.min.js',
)

const VIDEO_CACHE_NAME = 'loavies-vimeo-cache-v1'

/*
* We only have to install the serviceworker because we don't have any
* video's to precache. We only have a runtime cache, everything gets
* fetched once and then put into the runtime cache.
*/
self.addEventListener('install', () => {
  if (self.skipWaiting) {
    self.skipWaiting()
  }
})

/*
* Remove outdated caches
* https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker#removing_outdated_caches
*/
self.addEventListener('activate', event => {
  event.waitUntil(claimClientsAndRemoveOutdatedCaches(VIDEO_CACHE_NAME))
})

/*
* Serve segments from cache first if there are any. Otherwise, fetch
* the resource from network and put it in the vimeo cache for the
* next time the user visits our site.
*
* Only the requests to vimeo get intercepted, the rest will just be
* treated as a regular network requests.
*/
self.addEventListener('fetch', async event => {
  if (isVideoRequest(event.request)) {
    event.respondWith(getVideoFromCacheOrNetwork(event.request))
  }
})
