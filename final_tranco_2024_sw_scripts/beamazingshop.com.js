self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        var cache = await caches.open('cache');
        var res = await fetch(new Request('/site/offlinePWA', {cache: 'reload'}));
        cache.put('offline', res.clone());
    })());
});

self.addEventListener('fetch', function(event) {
    event.respondWith(async function() {
        try{
            let res = await fetch(event.request);
            return res;
        }
        catch(error){
            const cache = await caches.open('cache');
            let offlineRes = await cache.match('offline');
            return offlineRes;
        }
    }());
});