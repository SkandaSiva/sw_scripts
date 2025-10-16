//This is the "Offline page" service worker
const domainRoot = 'https://www.agridirect.ie/';
const offlineResources = ['offline.html','reload.png','noconnection.png','logo-offline.png'];

self.addEventListener('install', function(event) {
    for(var i=0;i<offlineResources.length;i++){
        var offlineResource = new Request(domainRoot+offlineResources[i]);
        event.waitUntil(
            fetch(offlineResource).then(function(response) {
                return caches.open('pwabuilder-offline').then(function(cache) {
                    console.log('[PWA Builder] Cached offline resource during Install'+ response.url);
                    return cache.put(offlineResource, response);
                });
            }));
    }
});

self.addEventListener('fetch', function(event) {
    var url = event.request.url;
    url = url.split("/");
    if(url[url.length-1].indexOf(".") == -1 && url[url.length-1].indexOf("?") == -1){
        console.log("Checking response of "+event.request.url);
        event.respondWith(
            fetch(event.request).catch(function(error) {
                console.error( '[PWA Builder] Network request Failed. Serving offline page ' + error );
                return caches.open('pwabuilder-offline').then(function(cache) {
                    return cache.match('https://www.agridirect.ie/offline.html');
            });
            }));
    }

});

self.addEventListener('refreshOffline', function(response) {
    return caches.open('pwabuilder-offline').then(function(cache) {
        console.log('[PWA Builder] Offline page updated from refreshOffline event: '+ response.url);
        return cache.put(offlinePage, response);
    });
});


self.addEventListener("fetch", function(event) {
    event.respondWith(
        fetch(event.request).catch(function(error) {
        console.log(
            "[Service Worker] Network request Failed. Serving content from cache: " +
            error
        );
        //Check to see if you have it in the cache
        //Return response
        //If not in the cache, then return error page
        return caches
            .open(
            "sw-precache-v3-sw-precache-webpack-plugin-https://www.agridirect.ie/?utm_source=homescreen"
            )
            .then(function(cache) {
            return cache.match(event.request).then(function(matching) {
                var report =
                !matching || matching.status == 404
                    ? Promise.reject("no-match")
                    : matching;
                return report;
            });
            });
        })
    );
});

// NOTIFICATIONS


self.addEventListener('push', function(event) {

  var data = JSON.parse(event.data.text());

  const title = data.title;
  const options = {
    body: data.message,
    icon: data.icon,
    badge: data.icon,
    click_action: data.link,
    data: JSON.stringify(data)
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {

    var data = JSON.parse(event.notification.data);

    event.notification.close();

    if (data.link){
        event.waitUntil(
            clients.openWindow(data.link)
        );
    }


});
