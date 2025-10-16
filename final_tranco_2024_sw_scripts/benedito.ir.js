importScripts("/precache-manifest.870d42406272213b6d5be017dabe759a.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('install', (event) => {
  self.skipWaiting();

  const version =31.1;
  console.log('installing service worker', event)
  // event.waitUntil(
  //     caches.open(CURRENT_CACHE)
  //         .then((cache) => {
  //             cache.adkAll(
  //                 [
  //                     "/",
  //                     "/static/css/style.css",
  //                     "/static/css/materialize.min.css",
  //                     "/static/js/materialize.min.js",
  //                     "/static/js/app.js",
  //                     "/static/css/vazir.css"
  //                 ]
  //             )
  //         })
  // )

})
self.addEventListener("beforeinstallprompt", (e) => {
})

self.addEventListener('fetch', () => {
  console.log('E')
})

self.addEventListener('activate', async () => {
  // after we've taken over, iterate over all the current clients (windows)
  const tabs = await self.clients.matchAll({type: 'window'})
  tabs.forEach((tab) => {
    // ...and refresh each one of them
    tab.navigate(tab.url)
  })
})

