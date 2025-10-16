self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('beforeinstallprompt', () => {
  console.log('beforeinstallprompt')
})

self.addEventListener('push', event => {
  console.log(event.data)
})

self.addEventListener('sync', event => {
  console.log(event)
})

self.addEventListener('fetch', async event => {
  const url = new URL(event.request.url)
  if (event.request.method === 'POST' && url.pathname === '/load-img') {
    const formData = await event.request.formData()
    const file = formData.get('img') || ''
    console.log('img: ', file)
  }
})
