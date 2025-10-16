self['appKey'] = "4ffc5a85eb59ede149aff75197a72c94";
self['hostUrl'] = "https://cdn.gravitec.net/sw";
self.importScripts(self['hostUrl'] + '/worker.js');

// Analytics
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');
if (workbox) {
    workbox.googleAnalytics.initialize({
        parameterOverrides: {
            cd1: 'pwa'
        }
    });

    var currentCache = {
        offline: 'offline-cache'
    };

    const offlineUrl = 'offline.html';

    this.addEventListener('install', event => {
        event.waitUntil(
            caches.open(currentCache.offline).then(function (cache) {
                return cache.addAll([
                    offlineUrl
                ]);
            })
        );
    });
}

