self._cacheOn = false;
self._activeSession = false;
self._cacheNamespace = 'OFFLINE';

const CACHE_CHECK_URL = this.location.origin + '/cache.namespace';

const OFFLINE_HTML = `
<!DOCTYPE html>
<html lang="pl">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0">
        <meta name="mobile-web-app-capable" content="yes">
    </head>

    <style>
        body {
            background-color: #d8d8d8;
            text-align: center;
        }

        p {
            color: #464646;
            font-family: 'ubuntu', 'open sans', 'arial';
            font-size: 12px;
        }

        img {
            margin-top: 2em;
            margin-bottom: 2em;
        }

        button {
            margin-top: 2em;
            display: inline-block;
            border: none;
            background-color: #444;
            color: #fff;
            padding: 0.55em 0.85em;
            cursor: pointer;
        }
    </style>

    <body>
        <p>
            <img src="/libraries/images/icon-offline.png" alt="Offline">
        </p>
        
        <p>
            <strong data-translate>You're not connected to the internet</strong><br>
        </p>

        <p data-translate>
            When you connect, refresh the page.
        </p>

        <button onclick="window.history.back()"><span data-translate>go back</span></button>
    </body>
    
    <script type="text/javascript">
        (function () {
            var lang;
            var toTranslate;
            var i;
            var length;
            var pl;
            var en;
            var navLength;
            var tempLang;

            translations = {
                pl: {
                    "You're not connected to the internet": "Nie masz połączenia z internetem",
                    "When you connect, refresh the page.": "Odśwież stronę, gdy połączysz się ponownie.",
                    "go back": "wróć"
                }
            };

            lang = window.navigator.language || window.navigator.userLanguage;

            if (window.navigator.languages) {
                navLength = window.navigator.languages.length;
                for (i = 0; i < navLength; i++) {
                    tempLang = window.navigator.languages[i].split('-')[0];

                    if (translations[tempLang] || tempLang === 'en') {
                        lang = tempLang;
                        break;
                    }
                }
            } else {
                lang = lang.split('-')[0];
            }

            if (!lang || lang === 'en') {
                return false;
            }

            toTranslate = document.querySelectorAll('[data-translate]');
            length = toTranslate.length;
            for (i = 0; i < length; i++) {
                if (translations[lang][toTranslate[i].innerHTML.trim()]) {
                    toTranslate[i].innerHTML = translations[lang][toTranslate[i].innerHTML.trim()];
                }
            }
        }).call(window);
    </script>
</html>
`;

const commands = {
    clearOldCache: function () {
        const currentCacheNamespace = self._cacheNamespace + '';
        caches.keys().then((keys) => {
            keys.forEach((key) => {
                if (key !== currentCacheNamespace) {
                    caches.delete(key);
                }
            });
        });
    }
};

self.addEventListener('install', (ev) => {
    caches.open(self._cacheNamespace).then((cache) => {
        cache.add('/libraries/images/icon-offline.png');
    });
    self.skipWaiting();
});

self.addEventListener('fetch', (ev) => {
    const url = ev.request.url;
    const isAdmin = [
        url.indexOf('admin') < 0,
        url.indexOf('console') < 0,
        url.indexOf('libraries') < 0,
        url.indexOf('aurora') < 0,
        url.indexOf(self.location.origin) === 0
    ];

    if (isAdmin.indexOf(false) >= 0) {
        return;
    }

    const searchParams = new URL(url).search;

    const conditions = [
        ev.request.method === 'GET',
        searchParams === '',
        url.indexOf(self.location.origin) === 0,
        url.indexOf('public/scripts/lang') < 0,
        url.indexOf('basket') < 0,
        url.indexOf('login') < 0,
        url.indexOf('logout') < 0,
        url.indexOf('webapi/front/inpost') < 0
    ];

    if (conditions.indexOf(false) < 0) {
        if (ev.request.mode === 'navigate' && navigator.onLine === true) {
            fetch(CACHE_CHECK_URL, {
                cache: 'no-cache'
            }).then((response) => {
                if (response.status === 200) {
                    response.text().then((namespace) => {
                        self._cacheNamespace = namespace;
                    });
                    commands.clearOldCache();
                }
            });
        }

        ev.respondWith(
            caches.open(self._cacheNamespace).then((cache) => {
                return cache.match(ev.request).then((cacheResponse) => {
                    if (
                        (cacheResponse && self._cacheOn && self._activeSession === false) ||
                        (cacheResponse && navigator.connection && navigator.connection.downlink <= 0.4)
                    ) {
                        return cacheResponse;
                    }

                    return fetch(ev.request)
                        .then((networkResponse) => {
                            if (ev.request.mode === 'navigate') {
                                if (
                                    !networkResponse.headers.get('cache-control') ||
                                    networkResponse.headers.get('cache-control').indexOf('no-store') < 0
                                ) {
                                    self._activeSession = false;
                                } else {
                                    self._activeSession = true;
                                }

                                if (networkResponse.headers.has('x-cache-namespace') && self._cacheNamespace !== 'OFFLINE') {
                                    self._cacheOn = true;
                                } else {
                                    self._cacheOn = false;
                                }

                                cache.add('/libraries/images/icon-offline.png');
                            }

                            if (self._activeSession === false) {
                                cache.put(ev.request, networkResponse.clone());
                            }

                            return networkResponse;
                        })
                        .catch(() =>
                            caches.match(ev.request).then((cacheResponse) => {
                                if (cacheResponse) {
                                    return cacheResponse;
                                }

                                if (navigator.onLine !== true) {
                                    return new Response(OFFLINE_HTML, {
                                        status: 200,
                                        headers: {
                                            'Content-Type': 'text/html',
                                            'Accept-Charset': 'utf-8'
                                        }
                                    });
                                }

                                self.registration.unregister();
                            })
                        );
                });
            })
        );
    } else {
        ev.respondWith(
            fetch(ev.request).then((networkResponse) => {
                if (
                    (networkResponse.headers.get('cache-control') && networkResponse.headers.get('cache-control').indexOf('no-store') >= 0) ||
                    networkResponse.type === 'opaqueredirect'
                ) {
                    self._activeSession = true;
                }

                return networkResponse;
            })
        );
    }
});

self.addEventListener('push', (ev) => {
    const notificationData = ev.data.json();

    const promiseChain = registration
        .getNotifications()
        .then((notifications) => {
            let currentNotification;

            for (let i = 0; i < notifications.length; i++) {
                if (parseInt(notifications[i].tag, 10) === notificationData.type) {
                    currentNotification = notifications[i];
                }
            }

            return currentNotification;
        })
        .then((currentNotification) => {
            let notificationTitle;
            const options = {
                icon: '/libraries/images/webpush/icon/active-webpush.png',
                badge: '/libraries/images/webpush/badge/badge.png'
            };

            if (currentNotification && currentNotification.data) {
                const notificationData = currentNotification.data;
                const count = notificationData.count + 1;

                if (notificationData.type === 1) {
                    options.icon = '/libraries/images/webpush/icon/new-order.png';
                }

                if (notificationData.type === 2) {
                    options.icon = '/libraries/images/webpush/icon/paid-order.png';
                }

                options.body = notificationData.content.multi.body || '';
                options.tag = notificationData.type;
                options.data = {
                    ...notificationData,
                    count
                };
                notificationTitle = notificationData.content.multi.message.replace('%s', count);

                currentNotification.close();
            } else {
                notificationTitle = notificationData.content.single.message;

                if (notificationData.type === 1) {
                    options.icon = '/libraries/images/webpush/icon/new-order.png';
                }

                if (notificationData.type === 2) {
                    options.icon = '/libraries/images/webpush/icon/paid-order.png';
                }

                options.body = notificationData.content.single.body || '';
                options.tag = notificationData.type;
                options.data = {
                    ...notificationData,
                    count: 1
                };
            }

            return self.registration.showNotification(notificationTitle, options);
        });

    ev.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', (ev) => {
    const notificationData = ev.notification.data;
    let url;

    if (notificationData.count > 1) {
        url = `${self.location.origin}/admin/`;

        if (notificationData.type === 1) {
            url = `${self.location.origin}/admin/orders/`;
        }

        if (notificationData.type === 2) {
            url = `${self.location.origin}/admin/orders/list/#/filter_payment_status/1/sort/paid_date/order/desc/page/1`;
        }
    } else {
        url = `${self.location.origin}/admin/orders/view/id/${notificationData.content.id}`;
    }

    ev.notification.close();

    ev.waitUntil(self.clients.openWindow(url));
});
