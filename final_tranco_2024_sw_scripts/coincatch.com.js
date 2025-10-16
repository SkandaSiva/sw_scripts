/**
 * staleWhileRevalidate：有缓存结果直接返回，在返回结果的同时会发起网络请求，更新cache
 * networkFirst：优先拿网络请求结果，请求结果返回并写入缓存，如果网络请求失败，那最后被缓存的 Cache 缓存结果就会被返回
 * cacheFirst：有缓存结果更新cache，然后在返回
 * networkOnly：直接强制使用正常的网络请求，比较适合对实时性要求非常高的请求
 * cacheOnly：直接使用 Cache 缓存的结果，比较适合上线就不会变的资源
 *
 * tips1：如果在同一域名,可以使用 workbox.strategies.cacheFirst() 进行缓存
 * tips2：不同域名绝对不能使用 Cache only 和 Cache first。可以使用 staleWhileRevalidate
 */
importScripts('./workbox-sw.js')

self.addEventListener('install', () => {
  self.skipWaiting()
})
self.addEventListener('activate', () => {
  self.clients.claim()
})
workbox.googleAnalytics.initialize()
// 首先是异常处理
self.addEventListener('error', function(e) {
  self.clients.matchAll().then(function(clients) {
    if (clients && clients.length) {
      clients[0].postMessage({
        type: 'ERROR',
        msg: e.message || null,
        stack: e.error ? e.error.stack : null
      })
    }
  })
})
self.addEventListener('unhandledrejection', function(e) {
  self.clients.matchAll().then(function(clients) {
    if (clients && clients.length) {
      clients[0].postMessage({
        type: 'REJECTION',
        msg: e.reason ? e.reason.message : null,
        stack: e.reason ? e.reason.stack : null
      })
    }
  })
})
// // 页面
// workbox.routing.registerRoute(
//     ({ request }) => request.mode === 'navigate',
//     new workbox.strategies.NetworkFirst({
//         cacheName: 'coincatch-navigation-cache',
//         plugins: [
//             new workbox.expiration.ExpirationPlugin({
//                 // 最大保存项目
//                 maxEntries: 32,
//                 // 缓存 1 天
//                 maxAgeSeconds: 24 * 60 * 60
//             }),
//             //确保仅缓存导致200状态的请求
//             new workbox.cacheableResponse.CacheableResponse({
//                 statuses: [200]
//             })
//         ]
//     })
// )
// 字体
workbox.routing.registerRoute(
  /.*\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)/g,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'coincatch-fonts-cache',
    plugins: [
      // 使用 expiration 插件实现缓存条目数目和时间控制
      new workbox.expiration.ExpirationPlugin({
        // 最大保存项目
        maxEntries: 6,
        // 缓存 7 天
        maxAgeSeconds: 7 * 24 * 60 * 60
      }),
      // 使用 cacheableResponse 插件缓存状态码为 0和200 的请求
      // 跨域请求状态码为0
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
)
// // coincatch img1图片
// workbox.routing.registerRoute(
//   ({ url }) => url.origin === 'https://img1.coincatch.com',
//   new workbox.strategies.StaleWhileRevalidate({
//     cacheName: 'coincatch-image-img1-cache',
//     plugins: [
//       new workbox.expiration.ExpirationPlugin({
//         maxEntries: 64,
//         maxAgeSeconds: 24 * 60 * 60
//       }),
//       new workbox.cacheableResponse.CacheableResponsePlugin({
//         statuses: [0, 200]
//       })
//     ]
//   })
// )
// 图片
workbox.routing.registerRoute(
  /.*\.(?:jpg|jpeg|gif|png|svg|ico|webp)/g,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'coincatch-image-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        // 最大保存项目
        maxEntries: 64,
        // 缓存 1 天
        maxAgeSeconds: 24 * 60 * 60
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
)
// 音视频
workbox.routing.registerRoute(
  /.*\.(?:mp3|mp4|wav|ogg)/g,
  new workbox.strategies.CacheFirst({
    cacheName: 'coincatch-media-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        // 最大保存项目
        maxEntries: 32,
        // 缓存 1 天
        maxAgeSeconds: 24 * 60 * 60
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
)
// 脚本
workbox.routing.registerRoute(
  /.*\.(?:js)/g,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'coincatch-js-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        // 最大保存项目
        maxEntries: 64,
        // 缓存 1 天
        maxAgeSeconds: 24 * 60 * 60
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
)
// 样式
workbox.routing.registerRoute(
  /.*\.(?:css)/g,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'coincatch-css-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        // 最大保存项目
        maxEntries: 64,
        // 缓存 1 天
        maxAgeSeconds: 24 * 60 * 60
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
)
