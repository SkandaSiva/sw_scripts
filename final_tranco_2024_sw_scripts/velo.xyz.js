const version = '1.0.239'
const CACHE_NAME = `cache-${version}`
const FILES_TO_CACHE = [
  '/assets/icons/warning-d.svg',
  '/assets/icons/warning-l.svg',
  '/assets/ag-grid-min.css',
  '/assets/ag-theme-quartz.min.css',
  '/assets/bootstrap@5.3.0.min.css',
  '/assets/bootstrap@5.3.0.min.js',
]
try{
self.addEventListener('install', function(event) {
  event.waitUntil(
    self.skipWaiting().then(()=>{
      return caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(FILES_TO_CACHE)
      })
    })
  )
      
})

self.addEventListener('activate', function(event) {
  caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      self.clients.claim()
    }).then(() => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'CACHE_CLEARED' })
        })
      })
    })
})

const controller = new AbortController()

self.addEventListener('fetch', (event) => {
  if(event.request.mode === 'navigate' || event.request.method === 'POST' || event.request.url.pathname === '/' || event.request.url.includes('api')){
    return
  }else if(event.request.url.includes('index.html') || event.request.url.includes('worker.js')){
    event.respondWith(fetch(event.request))
  }else{
    const signal = controller.signal
    event.respondWith(
      (async ()=>{
      const cachedRespose = await caches.match(event.request)
      
      if(cachedRespose){
        const clonedResponse = cachedRespose.clone()
        const headers = new Headers(clonedResponse.headers)
        headers.append('X-Cache-Hit', 'sw')
        return new Response(clonedResponse.body, {
          status: clonedResponse.status,
          statusText: clonedResponse.statusText,
          headers: headers
        })
      }else{
        return fetch(event.request, {signal}).then(async (response)=>{
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          
          const responseToCache = response.clone()
          if (event.request.url.includes('/assets/') || event.request.url.includes('bundle.js') || event.request.url.includes('jquery') || event.request.url.includes('bootstrap')) {
            const cache = await caches.open(CACHE_NAME)
            if(event.request.url.includes('http') || event.request.url.includes('https')){
              cache.put(event.request, responseToCache)
            }
          }
          return response
        }).catch((error)=>{
          console.error(error)
          return caches.match(event.request).then((cachedRespose)=>{
            if(cachedRespose){
              const clonedResponse = cachedRespose.clone()
              const headers = new Headers(clonedResponse.headers)
              headers.append('X-Cache-Hit', 'sw')
              return new Response(clonedResponse.body, {
                status: clonedResponse.status,
                statusText: clonedResponse.statusText,
                headers: headers
              })
            }
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            })
          })
        })
      }
    })(),
    )
  }
})

self.addEventListener('message', event => {
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: version })
  } else if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
}catch(err){
  console.error(err)
}