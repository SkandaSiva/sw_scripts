var cacheName = 'sopro';

self.addEventListener('install',function(e){
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            /*
            return cache.addAll([
                '/de-de/'
            ]);
            */
        })
    );
    self.skipWaiting().then(function(){
        console.log('Updated service worker');
    });
});

self.addEventListener('fetch',function(e){
    e.respondWith(
        caches.match(e.request).then(function(response){
            return response || fetch(e.request);
        })
    );
});
