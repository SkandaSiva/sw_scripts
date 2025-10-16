self.addEventListener('install', (event) => {})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable()
      }
    })()
  )

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim()
})
