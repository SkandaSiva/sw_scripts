self.addEventListener('install', () => {
  console.info('Service Worker installed.')
})

self.addEventListener('activate', () => {
  console.info('Service Worker activated.')
})

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
