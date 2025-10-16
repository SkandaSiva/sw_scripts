var cacheName = 'guppyWeb-v1';
const frequentFiles = [
    '/assets/img/Icon_Dildo_34x34.png',
    '/assets/img/Icon_Lush_34x34.png',
    '/assets/img/icon_brief_normal.png',
    '/assets/img/de.svg',
    '/assets/img/at.svg',
    '/assets/img/ch.svg'
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        await cache.addAll(frequentFiles);
    })());
});

self.addEventListener('push', function (event) {
    const pushInfoPromise = fetch('https://guppy.site/getNotificationData.aspx?ID=' + encodeURIComponent(event.data.text()) + "&scope=" + encodeURIComponent(self.registration.scope))
        .then(async function (response) {
            if (response.status === 200) {
                let data = await response.json();

                let title = data.title;
                let message = data.message;
                let icon;
                let badge;

                if (typeof(data.icon) !== "undefined") {
                    icon = data.icon;
                } else {
                    icon = "/assets/img/icon_brief_normal.png";
                }

                if (typeof(data.badge) !== "undefined") {
                    badge = data.badge;
                } else {
                    badge = "/assets/img/icon_brief_normal.png";
                }

                if (title == "") {
                    title = "Message";
                }
                if (icon == "") {
                    icon = "/assets/img/icon_brief_normal.png";
                }
                if (badge == "") {
                    badge = "/assets/img/icon_brief_normal.png";
                }

                console.log("push notification title: " + title + " | message: " + message + " | icon: " + icon + " | badge: " + badge);

                return self.registration.showNotification(title, {
                    body: message,
                    icon: icon,
                    badge: badge
                });
            } else {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
        });

    const promiseChain = Promise.all([
        pushInfoPromise
    ]);

    event.waitUntil(promiseChain);
});

self.addEventListener('notificationclose', function (event) {
    var notification = event.notification;
    console.log('Closed notification');
});

self.addEventListener('notificationclick', function (event) {
    var notification = event.notification;
    var clickURL;
    var action = event.action;

    if (action === 'close') {
        notification.close();
    } else {
        if (typeof (notification.data) !== "undefined") {
            if (notification.data == null) {
                clickURL = self.registration.scope;
                clients.openWindow(clickURL);
            } else {
                if (typeof (notification.data.clickURL) !== "undefined") {
                    clickURL = notification.data.clickURL;
                    if (clickURL == "" || clickURL == null) {
                        clickURL = self.registration.scope;
                    }
                    clients.openWindow(clickURL);
                } else {
                    clickURL = self.registration.scope;
                    clients.openWindow(clickURL);
                }
            }
        } else {
            clickURL = self.registration.scope;
            clients.openWindow(clickURL);
        }
        notification.close();
    }
});

/*self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) { return r; }

        const response = await fetch(e.request);

        if (e.request.url.indexOf("d3jg4n5aipvur8.cloudfront.net") > 0 || e.request.url.indexOf("d2cq08zcv5hf9g.cloudfront.net") > 0) {
            const cache = await caches.open(cacheName);
            console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
        }

        return response;
    })());
});*/