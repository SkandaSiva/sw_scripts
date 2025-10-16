'use strict';

var callback = [];

self.addEventListener('push', function (event) {
    var $payload = JSON.parse(event.data.text());
    var $d1 = Date.now();
    var $d2 = Date.now();
    if($payload['showNotificationUntil'] !== 0) {
        $d2 = new Date($payload['showNotificationUntil'].date + ' GMT+0200');
    }

    var title = '';
    var options = {};
    if ($d1 <= $d2) {
        title = $payload['title'];
        options = {
            body: $payload['body'],
            icon: $payload['options']['icon'],
            badge: $payload['options']['badge'],
            image: $payload['options']['image'],
            data: $payload['options']['data'],
            requireInteraction: true
        };
    } else {
        title = $payload['title2'];
        options = {
            body: $payload['body2'],
            icon: $payload['options2']['icon'],
            badge: $payload['options2']['badge'],
            data: $payload['options2']['data'],
            requireInteraction: true
        };
    }
    event.waitUntil(self.registration.showNotification(title, options));

    callback['callback'] = $payload['callback'];
    callback['url'] = $payload['callbackUrl'];

    postData(event.srcElement.origin + callback['url'], {
        action: 'notification_received',
        callback: callback['callback']
    });
});

self.addEventListener('notificationclick', function (event) {
    var promise = postData(event.srcElement.origin + callback['url'], {
        action: 'notification_open',
        callback: callback['callback']
    });
    event.waitUntil(clients.openWindow(event.notification.data.url));
    event.notification.close();
});

self.addEventListener('notificationclose', function (event) {
    postData(event.srcElement.origin + callback['url'], {
        action: 'notification_close',
        callback: callback['callback']
    });
});

function postData(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'client'
    });
}

importScripts('/cache-polyfill.js');

// Incrementing CACHE_VERSION will kick off the install event and force previously cached
// resources to be cached again.
var CACHE_VERSION = 7;
var CURRENT_CACHES = {
    offline: 'offline-v' + CACHE_VERSION
};
var OFFLINE_URL = '/offline/index.html';
var OFFLINE_ASSETS = ['/themes/default-bootstrap/assets/images/apacia_logo.svg', '/offline/beer.png', '/offline/shampoo.png', '/offline/box.png'];
var offline = false;

function createCacheBustedRequest(url) {
    var request = new Request(url, { cache: 'reload' });
    if ('cache' in request) {
        return request;
    }
    var bustedUrl = new URL(url, self.location.href);
    bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
    return new Request(bustedUrl);
}

self.addEventListener('install', function (event) {
    event.waitUntil(fetch(createCacheBustedRequest(OFFLINE_URL)).then(function (response) {
        return caches.open(CURRENT_CACHES.offline).then(function (cache) {
            // cache.put('/themes/default-bootstrap/assets/images/apacia_logo.svg', response)
            return cache.addAll([OFFLINE_URL].concat(OFFLINE_ASSETS));
        });
    }));
});

self.addEventListener('activate', function (event) {
    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames.map(function (cacheName) {
            if (expectedCacheNames.indexOf(cacheName) === -1) {
                console.log('Deleting out of date cache:', cacheName);
                return caches.delete(cacheName);
            }
        }));
    }));
});

self.addEventListener('fetch', function (event) {
    // Get document
    // if (event.request.mode === 'navigate' || event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
    //     event.respondWith(fetch(event.request).catch(function (error) {
    //         console.log(error, 'error');
    //         offline = true;
    //         return caches.match(OFFLINE_URL);
    //     }));
    // }

    // Get assets
    if (event.request.method === 'GET' && event.request.headers.get('accept').includes('image') && event.request.mode !== 'navigate' && offline) {
        event.respondWith(fetch(event.request).catch(function (error) {
            console.log(error, 'error');
            return caches.match(OFFLINE_ASSETS.find(function (asset) {
                return event.request.url.includes(asset);
            }));
        }));
    }
});
