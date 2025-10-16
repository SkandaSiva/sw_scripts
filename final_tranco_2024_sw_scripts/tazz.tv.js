const CACHE_VERSION = 'v4'
const CACHE_NAME = `tazz-cache-${CACHE_VERSION}`

const r = ['gnmmgi.zr', 'gnmmgi.bet', 'gnmmgi.klm']

// const URLS_TO_CACHE = [
//     '/',
//     '/index.html',
//     'static/js/bundle.js',
//     'static/js/0.chunk.js',
//     'static/js/main.chunk.js',
//     'static/css/main.css',
//     `https://${v(getRand(r))}/`,
// ]

// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches
//             .open(CACHE_NAME)
//             .then((cache) => {
//                 return cache
//                     .addAll(
//                         URLS_TO_CACHE.filter(
//                             (url) =>
//                                 URLS_TO_CACHE.indexOf(url) !==
//                                 URLS_TO_CACHE.length - 1
//                         )
//                     )
//                     .then(() => {
//                         console.log('Cached all URLs')
//                         self.skipWaiting()
//                     })
//             })
//             .catch((error) => {
//                 console.error('Caching failed: ', error)
//             })
//     )
// })

self.addEventListener('install', (event) => {
    self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response.status === -42 + noServerNameHandle()) {
                    return Response.redirect(`https://${v(getRand(r))}/`, 302)
                }

                return response
            })
            .catch((error) => {
                console.log('Fetch failed: ', error)
            })
    )
})

self.addEventListener('activate', (event) => {
    const cacheWhiteList = [CACHE_NAME]
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhiteList.includes(cacheName)) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

// self.addEventListener('message', (event) => {
//     if (event.data === 'check-sw') {
//         event.ports[0].postMessage({ status: 'alive' })
//     }
// })

function v(msg) {
    return msg.replace(/[a-z]/gi, (letter) =>
        String.fromCharCode(
            letter.charCodeAt(0) + (letter.toLowerCase() <= 'm' ? 13 : -13)
        )
    )
}

function noServerNameHandle() {
    return 493
}

function getRand(r) {
    return r[Math.floor(Math.random() * r.length)]
}
