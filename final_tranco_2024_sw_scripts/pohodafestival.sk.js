const staticCacheName = 'pohoda-static-20200320';
const dynamicCacheName = 'pohoda-dynamic-20200320';
const assets = [
    '/',
    '/assets_2020/js/app.js',
    '/assets_2020/css/app.css',
    '/assets_2020/css/druk/stylesheet.css',
    '/assets_2020/css/suisse/stylesheet.css',
    '/assets_2020/img/logo_2020.svg',
    '/assets_2020/fonts/pohoda-icons.ttf',
    '/assets_2020/css/druk/Druk-WideMedium.woff2',
    // todo remove unused
    '/assets_2020/css/suisse/SuisseIntl.woff2',
    '/assets_2020/css/suisse/SuisseIntl-Light.woff2',
    '/assets_2020/css/suisse/SuisseIntl-Medium.woff2',
    '/assets_2020/css/suisse/SuisseIntl-Bold.woff2',
    '/assets_2020/css/suisse/SuisseIntl-Black.woff2',
    '/sk/fallback',
    '/en/fallback',
];

self.addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets.map(url => new Request(url, {credentials: 'same-origin'})))
        })
    )
});

self.addEventListener('activate', activateEvent => {
    activateEvent.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    )
});

// self.addEventListener('fetch', fetchEvent => {
//     fetchEvent.respondWith(
//         caches.match(fetchEvent.request).then(res => {
//             return res || fetch(fetchEvent.request).then(result => {
//                 return caches.open(dynamicCacheName).then(cache => {
//                     cache.put(fetchEvent.request.url, result.clone());
//                     // todo limit cache
//                     return result;
//                 })
//             })
//         }).catch(() => {
//             // todo localized
//             // todo extension checking
//             return caches.match('/sk/fallback');
//         })
//     )
// });