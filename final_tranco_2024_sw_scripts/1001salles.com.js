var version = '1.3.0.0';
importScripts('https://notifpush.com/serviceworker.js');

const cacheName = '1001services1300';
const startPage = '/';
const offlinePage = '/offline/';
const filesToCache = [startPage, offlinePage, "/css/style.offline.min.css", "/css/opensans.min.css", "/js/offline/TweenMax.min.js", "/js/offline/brokebot.js", "/js/offline/snap.svg-min.js"];
const neverCacheUrls = [];
self.addEventListener('install', function(e) {
    e.waitUntil(caches.open(cacheName).then(function(cache) {
        return cache.addAll(filesToCache.map(url => new Request(url, {
            credentials: 'same-origin'
        })))
    }))
});
self.addEventListener('activate', function(e) {
    e.waitUntil(caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
            if (key !== cacheName) {
                return caches.delete(key)
            }
        }))
    }));
    return self.clients.claim()
});
self.addEventListener('fetch', function(e) {
	if (e.request.method === 'POST') {
		return;
	}
    if (!neverCacheUrls.every(checkNeverCacheList, e.request.url)) {
        return
    }
    if (!e.request.url.match(/^(http|https):\/\//i))
        return;
    if (new URL(e.request.url).origin !== location.origin)
        return;
    if (e.request.method !== 'GET') {
        e.respondWith(fetch(e.request).catch(function() {
            return caches.match(offlinePage)
        }));
        return
    }
    if (e.request.mode === 'navigate' && navigator.onLine) {
        e.respondWith(fetch(e.request).then(function(response) {
            return caches.open(cacheName).then(function(cache) {
                cache.put(e.request, response.clone());
                return response
            })
        }).catch(function( error ) {
			return caches.match(offlinePage);
		}));
        return
    }
    e.respondWith(caches.match(e.request).then(function(response) {
        return response || fetch(e.request).then(function(response) {
            return caches.open(cacheName).then(function(cache) {
                cache.put(e.request, response.clone());
                return response
            })
        })
    }).catch(function() {
        return caches.match(offlinePage)
    }))
});

function checkNeverCacheList(url) {
    if (this.match(url)) {
        return !1
    }
    return !0
}