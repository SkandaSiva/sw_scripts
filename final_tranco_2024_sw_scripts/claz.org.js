self.addEventListener('install', async () => {
    // console.log('Service worker installed')
   await self.skipWaiting();
})

self.addEventListener('activate', () => {
    // console.log('Service worker activated')
})

self.addEventListener('fetch', async event => {
    // console.log('Fetch event', event.request.url)
})
