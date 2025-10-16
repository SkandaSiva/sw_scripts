//This is the "Offline page" service worker
const domainRoot = 'https://www.thedandys.ie/';
const offlineResources = ['site/themes/thedandys.ie_2023/images/reload.png', 'site/themes/thedandys.ie_2023/images/noconnection.png', 'site/themes/thedandys.ie_2023/images/logo.png', 'offline.html'];


//Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener('install', function(event) {
    var offlineResource;
    for (var i = 0; i < offlineResources.length; i++) {
        offlineResource = new Request(domainRoot + offlineResources[i]);
        event.waitUntil(
            fetch(offlineResource).then(function(response) {
                    return caches.open('pwabuilder-offline').then(function(cache) {
                        //console.log('[PWA Builder] Cached offline resource during Install: '+ response.url);
                        return cache.add(offlineResource, response);
                    });
                },
                function(err) {
                    console.log("[PWA Builder] Error caching: " + err);
                }
            ));
    }
});

//If any fetch fails, it will show the offline page.
//Maybe this should be limited to HTML documents?
self.addEventListener('fetch', function(event) {
    var url = event.request.url;
    url = url.split("/");
    if (url[url.length - 1].indexOf(".") == -1) {
        //console.log("Fetching "+event.request.url);
        event.respondWith(
            fetch(event.request).catch(function(error) {
                //console.error( '[PWA Builder] Network request Failed. Serving offline page ' + error);
                return caches.open('pwabuilder-offline').then(function(cache) {
                    return cache.match('https://www.thedandys.ie/offline.html');
                });
            }));
    }

});

//This is a event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', function(response) {
    return caches.open('pwabuilder-offline').then(function(cache) {
        //console.log('[PWA Builder] Offline page updated from refreshOffline event: '+ response.url);
        return cache.put(offlinePage, response);
    });
});