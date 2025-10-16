let dataCacheName = 'new-data-v1'
let cacheName = 'first-pwa-app-1'
let filesToCache = [
    '/',
    '/dist/www/img/favicon.ico',
    '/dist/www/font/iconfont.css',
    '/dist/www/css/main.css',
    '/dist/www/css/Baloo2-ExtraBold.ttf',
    '/dist/www/css/Baloo2-Medium.ttf',
    '/dist/www/css/Jost-Medium.ttf',
    '/dist/www/css/Jost-Regular.ttf',
    '/dist/www/layui/layui.all.js',
    '/dist/www/js/jquery.min.js',
    '/dist/www/js/lazyload.js',
    '/dist/www/img/logo.png',
    '/dist/www/js/main.js',
    '/games/images/20231016/cafe_panic_cooking_games_180x180.png.html',
    '/games/images/20240621/ea_sports_fc_180x180.jpg.html'
]

self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(filesToCache)
    return self.skipWaiting()
})

self.addEventListener('activate', async e => {
    const keys = await caches.keys();
    keys.forEach(key=>{
        if (key !== cacheName && key !== dataCacheName) {
            caches.delete(key)
        }
    })
    return self.clients.claim()
})

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request)
        })
    )
})
