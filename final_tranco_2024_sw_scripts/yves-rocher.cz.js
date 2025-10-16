const cachePrefix = "644d0c517495bef3ffcf26872f60a041";


let lastClickedNotification = null;
self.addEventListener('push', function(event) {
    let data = {};
    if (event.data) {
        data = event.data.json();
    } else {
        return;
    }

    event.waitUntil(self.registration.showNotification(data.title, data.options));

    // Zapisz na serwerze informację o wyświetleniu powiadomienia
    if (self.fetch) {
        let bodyData = new FormData();
        bodyData.append('msg_id', data.options.data.hash);
        bodyData.append('event_type', '3');
        fetch('/webpush/event', {
            method: 'POST',
            cache: 'no-cache',
            body: bodyData
        });
    }
});
self.addEventListener('notificationclick', function(event) {
    // Android doesn't close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    // Dla Firefoxa zapamiętujemy, w co ostatnio ktoś kliknął, aby nie
    // zapisywać eventu close w przypadku kliknięcia w dymek
    lastClickedNotification = event.notification.data.hash;

    // Firefox nie tworzy event.action, ponieważ 22.12.2016 nie wspierał nadal parametru "actions"
    let actionSplitted = [];
    if (typeof(event.action) !== 'undefined') {
        actionSplitted = event.action.split(';');
    }

    // Ustalenie URLa, na który mamy przekierować
    let clickLink = '/';
    let clickElementID = 'default';
    if (typeof(actionSplitted[0]) !== 'undefined' && actionSplitted[0] === 'link'
        && typeof(actionSplitted[1]) !== 'undefined' && typeof(actionSplitted[2]) !== 'undefined') {
        clickLink = actionSplitted[1];
        clickElementID = actionSplitted[2];
    } else if (typeof(event.notification.data.link) !== 'undefined') {
        clickLink = event.notification.data.link;
    }

    // Zapisanie informacji nt. kliknięcia
    if (self.fetch) {
        let bodyData = new FormData();
        bodyData.append('msg_id', event.notification.data.hash);
        bodyData.append('event_type', '4');
        bodyData.append('click_link', clickLink);
        bodyData.append('click_element', clickElementID);
        fetch('/webpush/event', {
            method: 'POST',
            cache: 'no-cache',
            body: bodyData
        });
    }

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
            .then(function(clientList) {
                for (let i = 0; i < clientList.length; i++) {
                    let client = clientList[i];
                    if (client.url === '/' && 'focus' in client)
                        return client.focus();
                }
                if (clients.openWindow) {
                    return clients.openWindow(clickLink);
                }
            })
    );
});
self.addEventListener('notificationclose', function(event) {
    // Nie interesuje nas automatyczne zamknięcie powiadomienia po kliknięciu w nie
    // Chrome nie generuje eventu notificationclose w momencie kliknięcia w dymek, jednak
    // Firefox to robi, dlatego musimy to sprawdzać
    if (event.notification.data.hash === lastClickedNotification) {
        return;
    }

    // Zapisanie informacji nt. zamknięcia
    if (self.fetch) {
        let bodyData = new FormData();
        bodyData.append('msg_id', event.notification.data.hash);
        bodyData.append('event_type', '5');
        fetch('/webpush/event', {
            method: 'POST',
            cache: 'no-cache',
            body: bodyData
        });
    }
});
// Claim clients so that the very first page load is controlled by a service
// worker. (Important for responding correctly in offline state.)
self.addEventListener('activate', (event) => {
    self.clients.claim();

    if (typeof (precacheController) !== 'undefined') {
        event.waitUntil(precacheController.activate());
    }
    if (typeof(cachePrefix) !== 'undefined') {
        event.waitUntil(
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter(function (cacheName) {
                            let suffixes = ['-documents', '-css-cache', '-image-cache', '-minimal'];
                            for (let suffixIndex in suffixes) {
                                let suffix = suffixes[suffixIndex];
                                if (cacheName.indexOf(suffix) !== -1 && cacheName !== `${cachePrefix}${suffix}`) {
                                    return true;
                                }
                            }
                            return false;
                        })
                        .map(function (cacheName) {
                            return caches.delete(cacheName);
                        })
                );
            })
        );
    }
});

// Make sure the SW the page we register() is the service we use.
self.addEventListener('install', (event) => {
    if (typeof (precacheController) !== 'undefined') {
        event.waitUntil(precacheController.install());
    }
    self.skipWaiting();
});
importScripts('https://api.exponea.com/js/service-worker.min.js');
