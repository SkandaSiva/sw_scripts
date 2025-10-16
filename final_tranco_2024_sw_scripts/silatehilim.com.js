const CACHE = 'd6a586d8-daftplug-instantify';

importScripts('https://silatehilim.com/wp-content/plugins/daftplug-instantify/pwa/public/assets/js/workbox-v6.5.3/workbox-sw.js');

workbox.setConfig({
                                            modulePathPrefix: 'https://silatehilim.com/wp-content/plugins/daftplug-instantify/pwa/public/assets/js/workbox-v6.5.3/',
                                        });

workbox.core.setCacheNameDetails({
                                            prefix: 'daftplug-instantify',
                                            suffix: 'v7.6',
                                            precache: '',
                                            runtime: '',
                                        });

if (workbox) {
workbox.core.skipWaiting();
workbox.core.clientsClaim();
self.addEventListener('message', (event) => {
                                                if (event.data && event.data.type === 'SKIP_WAITING') {
                                                    self.skipWaiting();
                                                }
                                            });
self.addEventListener('install', async(event) => {
                                                    event.waitUntil(
                                                        caches.open(CACHE + '-html').then((cache) => cache.add('https://silatehilim.com/%d1%81%d1%82%d0%b0%d1%82%d1%8c%d0%b8/'))
                                                    );
                                                });
if (workbox.navigationPreload.isSupported()) {
                                                workbox.navigationPreload.enable();
                                            }
workbox.loadModule('workbox-cacheable-response');
workbox.loadModule('workbox-range-requests');
workbox.routing.registerRoute(/wp-admin(.*)|wp-json(.*)|(.*)preview=true(.*)/, new workbox.strategies.NetworkOnly());
workbox.routing.registerRoute(/(.*)cdn\.ampproject\.org(.*)/,
                                                new workbox.strategies.StaleWhileRevalidate({
                                                    cacheName: CACHE + '-amp',
                                                    plugins: [
                                                        new workbox.expiration.ExpirationPlugin({
                                                            maxEntries: 30,
                                                            maxAgeSeconds: 60 * 60 * 24 * 10,
                                                        }),
                                                        new workbox.cacheableResponse.CacheableResponsePlugin({
                                                            statuses: [0, 200]
                                                        }),
                                                    ],
                                                })
                                            );
workbox.routing.registerRoute(/(.*)fonts\.googleapis\.com(.*)|(.*)fonts\.gstatic\.com(.*)/,
                                                new workbox.strategies.StaleWhileRevalidate({
                                                    cacheName: CACHE + '-google-fonts',
                                                    plugins: [
                                                        new workbox.expiration.ExpirationPlugin({
                                                            maxEntries: 30,
                                                            maxAgeSeconds: 60 * 60 * 24 * 10,
                                                        }),
                                                        new workbox.cacheableResponse.CacheableResponsePlugin({
                                                            statuses: [0, 200]
                                                        }),
                                                    ],
                                                })
                                            );
workbox.routing.registerRoute(({event}) => event.request.destination === 'document',
                                                            async (params) => {
                                                                try {
                                                                    const response = await new workbox.strategies.NetworkFirst({
                                                                        cacheName: CACHE + '-html',
                                                                        plugins: [
                                                                            new workbox.expiration.ExpirationPlugin({
                                                                                maxEntries: 50,
                                                                                maxAgeSeconds: 60 * 60 * 24 * 10,
                                                                            }),
                                                                            new workbox.cacheableResponse.CacheableResponsePlugin({
                                                                                statuses: [0, 200]
                                                                            }),
                                                                        ],
                                                                    }).handle(params);
                                                                    return response || await caches.match('https://silatehilim.com/%d1%81%d1%82%d0%b0%d1%82%d1%8c%d0%b8/');
                                                                } catch (error) {
                                                                    console.log('catch:', error);
                                                                    return await caches.match('https://silatehilim.com/%d1%81%d1%82%d0%b0%d1%82%d1%8c%d0%b8/');
                                                                }
                                                            }
                                                        );

workbox.routing.registerRoute(({event}) => event.request.destination === 'script',
                                                            new workbox.strategies.StaleWhileRevalidate({
                                                                cacheName: CACHE + '-javascript',
                                                                plugins: [
                                                                    new workbox.expiration.ExpirationPlugin({
                                                                        maxEntries: 30,
                                                                        maxAgeSeconds: 60 * 60 * 24 * 10,
                                                                    }),
                                                                    new workbox.cacheableResponse.CacheableResponsePlugin({
                                                                        statuses: [0, 200]
                                                                    }),
                                                                ],
                                                            })
                                                        );
workbox.routing.registerRoute(({event}) => event.request.destination === 'style',
                                                            new workbox.strategies.StaleWhileRevalidate({
                                                                cacheName: CACHE + '-stylesheets',
                                                                plugins: [
                                                                    new workbox.expiration.ExpirationPlugin({
                                                                        maxEntries: 30,
                                                                        maxAgeSeconds: 60 * 60 * 24 * 10,
                                                                    }),
                                                                    new workbox.cacheableResponse.CacheableResponsePlugin({
                                                                        statuses: [0, 200]
                                                                    }),
                                                                ],
                                                            })
                                                        );
workbox.routing.registerRoute(({event}) => event.request.destination === 'font',
                                                            new workbox.strategies.StaleWhileRevalidate({
                                                                cacheName: CACHE + '-fonts',
                                                                plugins: [
                                                                    new workbox.expiration.ExpirationPlugin({
                                                                        maxEntries: 30,
                                                                        maxAgeSeconds: 60 * 60 * 24 * 10,
                                                                    }),
                                                                    new workbox.cacheableResponse.CacheableResponsePlugin({
                                                                        statuses: [0, 200]
                                                                    }),
                                                                ],
                                                            })
                                                        );
workbox.routing.registerRoute(({event}) => event.request.destination === 'image',
                                                            new workbox.strategies.StaleWhileRevalidate({
                                                                cacheName: CACHE + '-images',
                                                                plugins: [
                                                                    new workbox.expiration.ExpirationPlugin({
                                                                        maxEntries: 30,
                                                                        maxAgeSeconds: 60 * 60 * 24 * 10,
                                                                    }),
                                                                    new workbox.cacheableResponse.CacheableResponsePlugin({
                                                                        statuses: [0, 200]
                                                                    }),
                                                                ],
                                                            })
                                                        );
workbox.routing.registerRoute(({event}) => event.request.destination === 'video',
                                                            new workbox.strategies.CacheFirst({
                                                                cacheName: CACHE + '-videos',
                                                                plugins: [
                                                                    new workbox.expiration.ExpirationPlugin({
                                                                        maxEntries: 30,
                                                                        maxAgeSeconds: 60 * 60 * 24 * 10,
                                                                    }),
                                                                    new workbox.cacheableResponse.CacheableResponsePlugin({
                                                                        statuses: [0, 200]
                                                                    }),
                                                                    new workbox.rangeRequests.RangeRequestsPlugin(),
                                                                ],
                                                            })
                                                        );
workbox.routing.registerRoute(({event}) => event.request.destination === 'audio',
                                                            new workbox.strategies.CacheFirst({
                                                                cacheName: CACHE + '-audios',
                                                                plugins: [
                                                                    new workbox.expiration.ExpirationPlugin({
                                                                        maxEntries: 30,
                                                                        maxAgeSeconds: 60 * 60 * 24 * 10,
                                                                    }),
                                                                    new workbox.cacheableResponse.CacheableResponsePlugin({
                                                                        statuses: [0, 200]
                                                                    }),
                                                                    new workbox.rangeRequests.RangeRequestsPlugin(),
                                                                ],
                                                            })
                                                        );
workbox.googleAnalytics.initialize();

            workbox.routing.registerRoute(
                new RegExp('/*'),
                new workbox.strategies.NetworkOnly({
                    plugins: [
                        new workbox.backgroundSync.BackgroundSyncPlugin('bgSyncQueue', {
                            maxRetentionTime: 24 * 60
                        })
                    ]
                }),
                'POST'
            );}
self.addEventListener('activate', (event) => {
                                            event.waitUntil(
                                                caches.keys()
                                                    .then(keys => {
                                                        return Promise.all(
                                                            keys.map(key => {
                                                                if (/^(workbox-precache)/.test(key)) {
                                                                    console.log(key);
                                                                } else if (/^(([a-zA-Z0-9]{8})-([a-z]*))/.test(key)) {
                                                                    console.log(key);
                                                                    if (key.indexOf(CACHE) !== 0) {
                                                                        return caches.delete(key);
                                                                        key.keys().then(keys => {
                                                                            return Promise.all(
                                                                                keys.map(key => {
                                                                                    registration.index.delete(key.url);
                                                                                })
                                                                            )
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        );
                                                    })
                                            );
                                        });


                async function fetchAndCacheContent() {
                    var request = 'https://silatehilim.com/';
                    return caches.open(CACHE + '-html').then(function(cache) {
                        return fetch(request).then(function(response) {
                            return cache.put(request, response.clone()).then(function() {
                                return response;
                            });
                        });
                    });
                }

                self.addEventListener('periodicsync', (event) => {
                    if (event.tag === 'periodicSync') {
                        event.waitUntil(fetchAndCacheContent());
                    }
                });
            self.addEventListener('push', (event) => {
                                    if (event.data) {
                                        const pushData = event.data.json();
                                        event.waitUntil(self.registration.showNotification(pushData.title, pushData));
                                        navigator.setAppBadge(1).catch((error) => {
                                            console.log('Error setting App badge');
                                        });
                                    } else {
                                        console.log('No push data fetched');
                                    }
                                });
                                
                                self.addEventListener('notificationclick', (event) => {
                                    event.notification.close();
                                    switch (event.action) {
                                        case 'action1':
                                            event.waitUntil(clients.openWindow(event.notification.data.pushActionButton1Url));
                                        break;
                                        case 'action2':
                                            event.waitUntil(clients.openWindow(event.notification.data.pushActionButton2Url));
                                        break;
                                        default:
                                            event.waitUntil(clients.openWindow(event.notification.data.url));
                                        break;
                                    }
                                    navigator.clearAppBadge().catch((error) => {
                                        console.log('Error clearing App badge');
                                    });
                                });
                                
                                self.addEventListener('pushsubscriptionchange', function(event) {
                                    event.waitUntil(
                                        fetch('https://silatehilim.com/wp-admin/admin-ajax.php', {
                                            method: 'POST',
                                            headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({
                                                action: 'daftplug_instantify_handle_subscription_update',
                                                oldEndpoint: event.oldSubscription ? event.oldSubscription.endpoint : null,
                                                newEndpoint: event.newSubscription ? event.newSubscription.endpoint : null,
                                                newUserKey: event.newSubscription ? event.newSubscription.toJSON().keys.p256dh : null,
                                                newUserAuth: event.newSubscription ? event.newSubscription.toJSON().keys.auth : null
                                            })
                                        })
                                    );
                                });
