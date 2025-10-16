const staticCacheIM = 'iminded-static-vA4';
const dynamicCacheIM = 'iminded-dynamic-vA4';
const submap = "";
const staticAssets = [
    submap + '/',
    submap + '/index.html',
    submap + '/include/js',
    submap + '/include/css/style.min.css',
    submap + '/include/js/tween.min.js',
    submap + '/include/js/jquery-1.12.3.min.js',
    submap + '/include/js/preloader.min.js',
    submap + '/include/js/jquery.smoothState.min.js',
    submap + '/include/js/init.min.js',
    submap + '/include/js/timelines.min.js',
    '/https://fonts.googleapis.com/css?family=Merriweather+Sans&display=swap'
]

self.addEventListener('install', evt => {
    //console.log("SW installing");
    evt.waitUntil(
        caches.open(staticCacheIM).then(cache => {
            //console.log('caching static assets');
            cache.addAll(staticAssets);
        })
    )
});


self.addEventListener('activate', evt => {
    //console.log("SW activated");
    evt.waitUntil(
        caches.keys().then(keys => {
            // loop through all keys of caches and delete all except the latest version
            return Promise.all(keys
                .filter(key => key !== staticCacheIM && key !== dynamicCacheIM)
                .map(key => caches.delete(key))
            )
        })
    );
});


self.addEventListener('fetch', evt => {
    // get the stuff form the static cache if available
    evt.respondWith(
        caches.match(evt.request).then(cacheResponse => {
            //return either cache or fetch the file
            return cacheResponse || fetch(evt.request).then(fetchResponse => {
                return caches.open(dynamicCacheIM).then(cache => {
                    // put index , keyvalue (clone of stream, so we can return it to browser after caching)
                    cache.put(evt.request.url, fetchResponse.clone());
                    return fetchResponse;
                })
            });
        }).catch(() => {
            // gotta fix this (only return fallback page on missing .html link... hmmm)
            if (evt.request.url.indexOf('html') > -1) {
                return caches.match('/fallback.html')
            }
        })
    )
});