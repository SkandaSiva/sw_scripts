//Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener('install', function (event) {
    var offlinePage = new Request('/Themes/offline.php');
    event.waitUntil(
            fetch(offlinePage).then(function (response) {
        return caches.open('pwabuilder-offline').then(function (cache) {
            console.log('[PWA Builder] Cached offline page during Install' + response.url);
            return cache.put(offlinePage, response);
        });
    }));
});

//If any fetch fails, it will show the offline page.
//Maybe this should be limited to HTML documents?
self.addEventListener('fetch', function (event) {
    event.respondWith(
            fetch(event.request).catch(function (error) {
        console.error('[PWA Builder] Network request Failed. Serving offline page ' + error);
        return caches.open('pwabuilder-offline').then(function (cache) {
            return cache.match('/Themes/offline.php');
        });
    }
    ));
});

//This is a event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', function (response) {
    return caches.open('pwabuilder-offline').then(function (cache) {
        console.log('[PWA Builder] Offline page updated from refreshOffline event: ' + response.url);
        return cache.put(offlinePage, response);
    });
});

/*
 self.addEventListener('install', function (event) {
 var indexPage = new Request('index.html');
 event.waitUntil(fetch(indexPage).then(function (response) {
 return caches.open('pwabuilder-offline').then(function (cache) {
 return cache.put(indexPage, response);
 });
 }));
 });
 
 self.addEventListener('fetch', function (event) {
 var updateCache = function (request) {
 return caches.open('pwabuilder-offline').then(function (cache) {
 return fetch(request).then(function (response) {
 return cache.put(request, response);
 });
 });
 };
 
 event.waitUntil(updateCache(event.request));
 
 event.respondWith(fetch(event.request).catch(function (error) {
 return caches.open('pwabuilder-offline').then(function (cache) {
 return cache.match(event.request).then(function (matching) {
 var report = !matching || matching.status == 404 ? Promise.reject('no-match') : matching;
 return report
 });
 });
 }));
 });
 
 self.addEventListener('install', function(event) {
 var offlinePage = new Request('/Themes/offline.php');
 event.waitUntil(
 fetch(offlinePage).then(function(response) {
 return caches.open('pwabuilder-offline').then(function(cache) {
 console.log('[PWA Builder] Cached offline page during Install'+ response.url);
 return cache.put(offlinePage, response);
 });
 }));
 });
 */