var VERSION = 'sw-v91';
this.addEventListener('install', function (e) {
    console.log('%c log: Service Worker installed! ' + VERSION, 'background: green; color: yellow;font-weight: bold;padding:1px');
    e.waitUntil(caches.open(VERSION).then(cache => {
        return cache.addAll([
            '/js/zb_7.min.js',
            '/js/zb_os_11.js',
            '/css/zb_css_4.min.css',
            '/manifest.js',

            '/bootstrap53_2/fonts/bootstrap-icons.woff',
            '/bootstrap53_2/fonts/bootstrap-icons.woff2',
            '/bootstrap53_2/bootstrap.bundle.min.js',
            '/bootstrap53_2/bootstrap.rtl.min.css',

            '/js/jquery.canvasjs.stock.min.js',
            '/js/ChartJS/chart.umd.min.js',
            'js/ChartJS/chartjs-chart-treemap.min.js',
            '/fonts/IRANSansXFaNum-Bold.woff2',
            '/fonts/IRANSansXFaNum-Regular.woff2',
            //'/fonts/IRANSansX-bold.woff',
            //'/fonts/IRANSansX-regular.woff',
            //'/fonts/5/IRANSansWeb(FaNum)_Bold.woff2',
            //'/fonts/5/IRANSansWeb(FaNum).woff2',
            '/img/favicon.png',
            '/img/load2.gif',
            '/img/load1.gif'

        ]);
    }))
});
this.addEventListener('activate', function (e) {
    console.log('log: activate');
    e.waitUntil(caches.keys().then(keys => {
        return Promise.all(keys.map(key => {
            if (key !== VERSION)
                return caches.delete(key);
        }));
    }));
});
this.addEventListener('fetch', event => {
    // Let the browser do its default thing
    // for non-GET requests.
    if (event.request.method != 'GET') return;

    // Prevent the default, and handle the request ourselves.
    event.respondWith(async function () {
        // Try to get the response from a cache.
        const cache = await caches.open(VERSION);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
            // If we found a match in the cache, return it, but also
            // update the entry in the cache in the background.

            //event.waitUntil(cache.add(event.request));
            return cachedResponse;
        }

        // If we didn't find a match in the cache, use the network.
        return fetch(event.request);
    }());
});
//push notification
self.addEventListener('push', function (event) {
    return;
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'Push Codelab';
    const options = {
        body: 'Yay it works.',
        icon: 'img/icon.png',
        badge: 'img/badge.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (e) {
    return;
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow('https://optionbaaz.ir');
        notification.close();
    }
});
self.addEventListener('notificationclose', function (e) {
    return;
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;

    console.log('Closed notification: ' + primaryKey);
});






