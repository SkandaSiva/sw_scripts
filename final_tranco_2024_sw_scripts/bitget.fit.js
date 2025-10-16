importScripts('./workbox-sw.js')

self.addEventListener('install', () => {
    self.skipWaiting()
})

self.addEventListener('activate', () => {
    self.clients.claim()
})

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
//         cacheName: 'bitget-navigation-cache',
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
        cacheName: 'bitget-fonts-cache',
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

// // bitgetimg图片
// workbox.routing.registerRoute(
//     ({ url }) => url.origin === 'https://img.bitgetimg.com',
//     new workbox.strategies.StaleWhileRevalidate({
//         cacheName: 'bitget-bitgetimg-cache',
//         plugins: [
//             new workbox.expiration.ExpirationPlugin({
//                 maxEntries: 64,
//                 maxAgeSeconds: 24 * 60 * 60
//             }),
//             new workbox.cacheableResponse.CacheableResponsePlugin({
//                 statuses: [0, 200]
//             })
//         ]
//     })
// )

// 图片
workbox.routing.registerRoute(
    /.*\.(?:jpg|jpeg|gif|png|svg|ico|webp)/g,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'bitget-image-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 64,
                maxAgeSeconds: 24 * 60 * 60
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [200]
            })
        ]
    })
)

// // 音视频
// workbox.routing.registerRoute(
//     /.*\.(?:mp3|mp4|wav|ogg)/g,
//     new workbox.strategies.CacheFirst({
//         cacheName: 'bitget-media-cache',
//         plugins: [
//             new workbox.expiration.ExpirationPlugin({
//                 maxEntries: 32,
//                 maxAgeSeconds: 24 * 60 * 60
//             }),
//             new workbox.cacheableResponse.CacheableResponsePlugin({
//                 statuses: [0, 200]
//             })
//         ]
//     })
// )

// 脚本
workbox.routing.registerRoute(
    /.*\.(?:js)/g,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'bitget-js-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 64,
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
        cacheName: 'bitget-css-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 64,
                maxAgeSeconds: 24 * 60 * 60
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [200]
            })
        ]
    })
)
