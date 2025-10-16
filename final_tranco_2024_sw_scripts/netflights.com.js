self.addEventListener('install', function (event) {
    event.waitUntil(preLoad());
});

var preLoad = function () {
    console.log('[NetFlights] Install Event processing');
    var offlineFilePath = '/';
    var offlineFileName = offlineFilePath + getDomainOfflineFileName();
    return caches.open('netflights-offline').then(function (cache) {
        console.log('[NetFlights] Cached offline page during Install');
        return cache.addAll([offlineFileName]);
    });
}

var getDomainOfflineFileName = function () {
    var currentHost = self.location.host;
    switch (currentHost.toLowerCase()) {
        case "www.netflights.com":
            return 'offline.html?v=1';
        case "www.netflights.ae":
            return 'offline-ae.html?v=1';
        default:
            return 'offline.html?v=1';
    }
}

self.addEventListener('fetch', function (event) {
    if ( event.request.mode === 'navigate' ||
        (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        var offlineFileName = getDomainOfflineFileName();
        event.respondWith(
          fetch(event.request).catch(function (error) {
              console.error('[NetFlights] Network request Failed. Serving offline page ' + error);
              return caches.open('netflights-offline').then(function (cache) {
                  return cache.match(offlineFileName);
              });
          }));
    }
});

//This is a event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', function (response) {
    return caches.open('netflights-offline').then(function (cache) {
        console.log('[NetFlights] Offline page updated from refreshOffline event: ' + response.url);
        return cache.put(offlinePage, response);
    });
});