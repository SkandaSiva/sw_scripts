// Service Worker PWA Cartoradio

self.addEventListener('install', event => {
  // console.log('sw-pwa', 'install', event)
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  // console.log('sw-pwa', 'activate', event)
})

self.addEventListener('fetch', event => {
  // console.log('sw-pwa', 'fetch', event)
})
