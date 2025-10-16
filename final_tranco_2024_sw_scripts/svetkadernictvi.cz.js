self.addEventListener('install', (event) => { // event when service worker install
    //console.log( 'install', event);
    self.skipWaiting();
});

self.addEventListener('activate', (event) => { // event when service worker activated
    //console.log('activate', event);
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) { // HTTP request interceptor
    /*
    // send all http request without any cache logic
    event.respondWith(fetch(event.request)); 
    */
    
    /*
    // cache new request. if already in cache serves with the cache.
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event. request);
        })
    );
    */
    
    // pokud neni nikdy volano event.respondWith(); = bezne chovani prohlizece
});