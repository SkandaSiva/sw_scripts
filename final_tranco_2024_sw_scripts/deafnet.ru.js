var version = 6,
oldAppShell = 'appShell-'+(version-1),
appShell = 'appShell-'+version;
var filesToCache = [
'/js/jqu3.js',
'/js/bootstrap.js',
'/assets/js/wow.min.js',
'/assets/js/scrollup.js',
'/assets/js/main.js',
'/images/dnlogo.png',
'/assets/fonts/fa-solid-900.woff2',
'/assets/css/fontawesome-all.min.css',
'/assets/css/animate.min.css',
'/vendor/sweetalert/sweetalert.min.js',
'/vendor/slick/slickall.css',
'/fonts/line-awesome/css/line.css',
'/assets/css/style.css'];

self.addEventListener('install', evt => {
evt.waitUntil(
caches.open(appShell).then((cache) => {
console.log('caching shell');
cache.addAll(filesToCache);
})
);});
self.addEventListener('activate', function(event) {
    var expectedCacheNames = Object.keys(filesToCache).map(function(key) {
        return filesToCache[key];
    });
    // Delete out of date cahes
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) == -1) {
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

/*
self.addEventListener('activate', evt => {
evt.waitUntil(
caches.keys().then(keys => {
return Promise.all(keys
.filter(key => key !== appShell)
.map(key => caches.delete(key))
);
})
);});
self.addEventListener('fetch', evt => {
evt.respondWith(
caches.match(evt.request).then(cacheRes => {
return cacheRes || fetch(evt.request);
})
);
});
*/
/*
self.addEventListener('activate', function(e) {
e.waitUntil(
caches.delete(oldAppShell).open(appShell).then(function(cache) {
return cache.addAll(appShell);
}).catch(function(err){console.log(err);})
);
});*/