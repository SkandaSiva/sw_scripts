var CACHE_VERSION = 2312;
var CURRENT_CACHES = {
    prefetch: 'futurama-v' + CACHE_VERSION,
    dynamic: 'futurama-dynamic-v' + CACHE_VERSION
};
self.addEventListener('install', function(e) {
    var urlsToPrefetch = ['offline.html', './img/body-min.jpeg', 'img/icons.min.svg'];
    self.skipWaiting();
    e.waitUntil(caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
        return cache.addAll(urlsToPrefetch);
    }));
});
self.addEventListener('activate', function(e) {
    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
        return CURRENT_CACHES[key];
    });
    e.waitUntil(caches.keys().then(function(cacheNames) {
        return Promise.all(cacheNames.filter(function(cacheName) {
            if (cacheName === CURRENT_CACHES.prefetch || cacheName === CURRENT_CACHES.dynamic) {
                return false;
            }
            return true;
        }).map(function(cacheName) {
            if (expectedCacheNames.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
            }
        }));
    }));
});

function getExtension(url) {
    var u = new URL(url),
        basename = u.pathname.split(/[\/]/).pop(),
        pos = basename.lastIndexOf('.');
    if (basename === '' || pos < 1) return '';
    return basename.slice(pos + 1);
}

function nonCache(url) {
    return url.startsWith('chrome-extension://') || url.indexOf('/administrator') > -1;
}

function useCache(url) {
    return url.indexOf('/icons') > -1 || url.indexOf('/poster') > -1 || url.indexOf('/temporada') > -1 || url.indexOf('1x') > -1 || url.indexOf('2x') > -1 || url.indexOf('3x') > -1 || url.indexOf('x4') > -1 || url.indexOf('x5') > -1 || url.indexOf('x6') > -1 || url.indexOf('x7') > -1;
}
self.addEventListener('fetch', function(e) {
    var ext = getExtension(e.request.url),
        exclude = ['mp4', 'mpd', 'm3u', 'm3u8', 'ts', 'm4s', 'm4a', 'aac', 'mkv'];
    if (e.request.headers.get('range') || nonCache(e.request.url) || useCache(e.request.url) === false || (ext !== '' && exclude.indexOf(ext) > -1)) {
        return;
    } else {
        e.respondWith(caches.match(e.request).then(function(response) {
            return response || fetch(e.request).then(function(fetchRes) {
                return caches.open(CURRENT_CACHES.dynamic).then(function(cache) {
                    if (useCache(e.request.url) && !nonCache(e.request.url)) {
                        cache.put(e.request.url, fetchRes.clone());
                    }
                    return fetchRes;
                });
            });
        }).catch(function() {
            return caches.match('/offline.html');
        }));
    }
});