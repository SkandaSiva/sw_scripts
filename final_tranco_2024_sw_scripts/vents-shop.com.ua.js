const PRECACHE = 'vshop-v1';
const RUNTIME = 'runtime';
const FALLBACK =
    '<div>\n' +
    '    <h3>Ви тимчасово офлайн. </br>Перевірте, будь ласка, </br> своє підключення до інтернету</h3>\n' +
    '</div>';

// -- A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    '/offline.html',
    '/images/logoicon128.png',
];

// -- 1. Setup service worker and add files to cache
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    );
});

// 2. The activate handler takes care of cleaning up old caches.
// self.addEventListener('activate', (event) => {
//     event.waitUntil(self.clients.claim());
// });
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// self.addEventListener('fetch', event => {
//     // Skip cross-origin requests, like those for Google Analytics.
//     if (event.request.url.startsWith(self.location.origin)) {
//         event.respondWith(
//             caches.match(event.request).then(cachedResponse => {
//                 if (cachedResponse) {
//                     return cachedResponse;
//                 }
//
//                 return caches.open(RUNTIME).then(cache => {
//                     return fetch(event.request).then(response => {
//                         // Put a copy of the response in the runtime cache.
//                         return cache.put(event.request, response.clone()).then(() => {
//                             return response;
//                         });
//                     });
//                 });
//             })
//         );
//     }
// });
//


self.addEventListener('fetch', function(event) {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
        // for non-GET requests.
        if (event.request.method != 'GET') return;

        // If something wrong ;)
        if (self.registration.scope == undefined || self.registration.scope.length <= 0) return;

        // Works only in my host's resources
        var myUrl = self.registration.scope.replace(/(^\w+:|^)\//, '');
        var isMyHost = (event.request.url.indexOf(myUrl) >= 0);
        if (!isMyHost) return;

        // exclude .php
        var isPhp = (event.request.url.indexOf('.php') >= 0);
        if (isPhp) return;

        event.respondWith(
            networkOrCache(event.request).catch(function () {return useStatic();})
        );
    }
});

function networkOrCache(request) {
    return fetch(request, {credentials: "same-origin"})
           .then(function(response) {
               if (response.type != undefined && response.type == 'basic' && response.status == 200) {
                   return (response.ok ? response : fromCache(request));
               } else {
                   return response;
               }
           })
           .catch (function () {
               return useFallback();
           });
}

function fromCache(request) {
    return caches.open(PRECACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}


function useFallback() {
    var request = new Request('/offline.html');

//    return useStatic();
    var res =  caches.open(PRECACHE)
                     .then((cache) =>cache.match(request).then((matching) => matching || Promise.reject('no-match')))
                     .catch (function () {
                        return useStatic();
                     });
    return res;
}

function useStatic() {
      return Promise.resolve(new Response(FALLBACK, { headers: {
     'Content-Type': 'text/html; charset=utf-8'
     }}));
}

self.addEventListener('push', function(event) {
    console.log('push');
});

self.addEventListener('message', function(event) {
    console.log('message');
});
