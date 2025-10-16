const CACHE_NAME = 'fameex-cache-v1'
const CACHE_PREFIX = 'lib/trading_view'

const cacheFirstResponse = (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // 检查文件是否发生变化
          return fetch(event.request, { method: 'HEAD' }).then(
            (networkResponse) => {
              if (networkResponse.status === 200) {
                const cachedLastModified =
                  cachedResponse.headers.get('Last-Modified')
                const networkLastModified =
                  networkResponse.headers.get('Last-Modified')
                if (cachedLastModified !== networkLastModified) {
                  // 文件发生变化，更新缓存
                  return fetch(event.request).then((updatedResponse) => {
                    cache.put(event.request, updatedResponse.clone())
                    return updatedResponse
                  })
                }
              }
              return cachedResponse
            }
          )
        }
        // 缓存未命中，请求网络资源并缓存
        return fetch(event.request).then((fetchedResponse) => {
          cache.put(event.request, fetchedResponse.clone())
          return fetchedResponse
        })
      })
    })
  )
}

const cleanCache = (cacheWhitelist) => {
  return caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName)
        }
      })
    )
  })
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting()) // 强制等待中的 Service Worker 被激活
})

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url)
  // 缓存所有字体文件
  if (event.request.destination === 'font') {
    cacheFirstResponse(event)
  }
  // 缓存 TradingView 图表库
  if (event.request.url.includes(CACHE_PREFIX)) {
    cacheFirstResponse(event)
  }
  // 缓存同源图片
  if (requestUrl.origin === location.origin) {
    if (
      event.request.destination === 'image' &&
      !event.request.url.includes('data:') &&
      !event.request.url.includes('favicon.ico')
    ) {
      cacheFirstResponse(event)
    }
  }
})

// 激活 Service Worker 时，清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    cleanCache([CACHE_NAME]).then(() => self.clients.claim()) // 立即接管控制
  )
})
