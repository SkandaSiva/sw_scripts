const CACHE_VERSION = 10;
const CURRENT_CACHES = {
        offline: 'offline_page_v' + CACHE_VERSION
    };


const OFFLINE_URL = '/offline_page/';
const OFFLINE_RESOURCES = [ 
                           'https://cdn.freeriderhd.com/free_rider_hd/assets/images/icons/menu_icons_v2.png',
                           'https://cdn.freeriderhd.com/free_rider_hd/assets/images/icons/menu_icons_v2@2x.png',
                           'https://cdn.freeriderhd.com/free_rider_hd/assets/images/icons/menu_icons_v2@3x.png',
                           
                           'https://cdn.freeriderhd.com/free_rider_hd/sprites/guest_profile_v2.png',

                           'https://cdn.freeriderhd.com/free_rider_hd/assets/images/badges/chrome_badge.png',
                           'https://cdn.freeriderhd.com/free_rider_hd/assets/images/badges/chrome_badge@2x.png',

                           'https://cdn.freeriderhd.com/free_rider_hd/assets/images/badges/google_play_badge.png',
                           'https://cdn.freeriderhd.com/free_rider_hd/assets/images/badges/google_play_badge@2x.png',

                           'https://cdn.freeriderhd.com/free_rider_hd/assets/images/badges/app_store_badge.png',
                           'https://cdn.freeriderhd.com/free_rider_hd/assets/images/badges/app_store_badge@2x.png',
                           
                           'https://cdn.freeriderhd.com/free_rider_hd/assets/fonts/riffic_bold_macroman/riffic-bold-webfont.woff',
                           'https://cdn.freeriderhd.com/free_rider_hd/assets/fonts/roboto_regular_macroman/Roboto-Regular-webfont.woff',
                           'https://cdn.freeriderhd.com/free_rider_hd/assets/fonts/roboto_medium_macroman/Roboto-Medium-webfont.woff',
                           'https://cdn.freeriderhd.com/free_rider_hd/assets/fonts/roboto_bold_macroman/Roboto-Bold-webfont.woff',

                           'https://cdn.freeriderhd.com/free_rider_hd/styles/application/frhd_app.min.494.346706218.css',
                           'https://cdn.freeriderhd.com/free_rider_hd/assets/styles/combined/gui/combined.min.120.16.32.45.css',
                           OFFLINE_URL
                        ];

self.addEventListener('install', function(event) {
    event.waitUntil(
            caches.open(CURRENT_CACHES.offline).then(function(cache) {
            return cache.addAll(OFFLINE_RESOURCES);
        }).then(function() {
            if (typeof self.skipWaiting === 'function')
            {
                return self.skipWaiting();
            }
            return;
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then(function(keyList) {
                return Promise.all(keyList.map(function(key){
                    if ([CURRENT_CACHES.offline].indexOf(key) === -1) {
                        return caches.delete(key);
                    }
                }));
            })
    );
});

//If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', function(event) {
    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) 
    {
        event.respondWith(
            fetch(event.request).catch(function(error) {
                return caches.open(CURRENT_CACHES.offline).then(function(cache) {
                    return cache.match(event.request).then(function (response) {
                        return response || cache.match(OFFLINE_URL);
                    });
                })
            })
        )
    }
});