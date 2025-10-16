var offlineAssetsInclude = [/\.html/, /\.js$/, /\.json$/, /\.css$/, /\.woff$/, /\.png$/, /\.jpe?g$/, /\.gif$/, /\.ico$/];
var CACHE_NAME = 'static-cache-v10';
const OFFLINE_URL = 'offline.html';
var self = this;
this.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(
                [
                    '/offline.html',
                    '/eamissions-logo.png',
                    '/images/favicon.ico',
                    '/css/main.css'
                ]
            );
        }).then(function (e) {
            return self.skipWaiting();
        })
    );

    // self.skipWaiting()
});

this.addEventListener('push', function (event) {
   // console.log(event.data.json())
    try {
        let response = event.data.json();
        const title = 'eAdmissions';
        const options = {
            body: response.text,
            data: response.url
        };
        event.waitUntil(this.registration.showNotification(title, options));

        // var n = new Notification(title,options);

    } catch (e) {
        //   console.log('err',e.name)
        if (e.name == 'TypeError')
            return false;
    }
    // navigator.serviceWorker.ready
    // 	.then(function(registration) {
    //         const title = 'Push Codelab';
    //         const options = {
    //           body: 'Yay it works.',
    //           icon: 'images/icon.png',
    //           badge: 'images/badge.png'
    //         };

    //         event.waitUntil(registration.showNotification(title, options));

    //     });

});

this.addEventListener('notificationclick', function (event) {
    // console.log('[Service Worker] Notification click Received.',event.notification.data);  
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
});

this.addEventListener('activate', async function (event) {
    // Delete unused caches
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

this.addEventListener("fetch", function (event) {
    if (event.request.method === 'GET') {

        event.respondWith(caches.match(event.request).then(function (response) {
            // caches.match() always resolves
            // but in case of success response will have value
            if (response !== undefined) {
                return response;
            } else {

                return fetch(event.request).then(function (response) {
                    return response;
                })
            }
        })
            .catch(async (err) => {
                //    console.log('catch',err.statusCode)
                //  console.log('Fetch failed; returning offline page instead.', err);  
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(OFFLINE_URL);
                return cachedResponse;

            })
        );
    }
});

