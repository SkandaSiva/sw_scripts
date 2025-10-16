importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');
const { strategies, expiration } = workbox;

const cacheStorage = 'LHR-precache';
const filesToCache = [
    '/etc.clientlibs/langhamhotels/clientlibs-lhg/clientlib-all.css',
    '/etc.clientlibs/langhamhotels/clientlibs-lhg/clientlib-homepage.css',
    '/etc.clientlibs/langhamhotels/clientlibs-lhg/clientlib-contentpage.css',
    '/etc.clientlibs/langhamhotels/clientlibs-lhg/clientlib-all.js',
    '/etc.clientlibs/langhamhotels/clientlibs-lhg/clientlib-homepage.js',
    '/etc.clientlibs/langhamhotels/clientlibs-lhg/clientlib-contentpage.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheStorage).then(cache => {
            return cache.addAll(filesToCache);
        }).then(() => self.skipWaiting()).catch((e) => {
            console.log(e);
            self.skipWaiting()
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(cacheKeys => {
        return Promise.all(
            cacheKeys.filter((key) => {
            }).map((key) => {
                return caches.delete(key);
            })
        );
    }).then(() => self.clients.claim()).catch((e) => {
        console.log(e);
        self.clients.claim()
    })
    )
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const paths = url.pathname.split('/');
    let cacheStrategy;

    if (event.request.method == 'POST') {
        const preLoadResponse = event.preLoadResponse;
        if (preLoadResponse) {
            event.respondWith(preLoadResponse);
        }
    } else {
        if (paths.length > 2) {
            if (event.request.destination === 'image') {
                cacheStrategy = new strategies.NetworkFirst({
                    cacheName: 'IMAGE-CACHE',
                    plugins: [
                        new expiration.ExpirationPlugin({
                            maxEntries: 60,
                            maxAgeSeconds: 30 * 24 * 60 * 60,
                        }),
                    ]
                });
            } else if (event.request.destination === 'font') {
                cacheStrategy = new strategies.CacheFirst({
                    cacheName: 'FONT-CACHE'
                });
            } else if (event.request.destination === 'script' || event.request.destination === 'style') {
                cacheStrategy = new strategies.NetworkFirst({
                    cacheName: 'JS-CSS-CACHE'
                });
            } else {
                cacheStrategy = new strategies.NetworkFirst({
                    cacheName: 'OTHER-CACHE'
                });
            }
        } else {
            cacheStrategy = new strategies.CacheFirst({
                cacheName: 'STATIC-CACHE'
            });
        }
    
        event.respondWith(cacheStrategy.handle({ request: event.request, event: event }));
    }
});

self.addEventListener('message', (event) => {
    console.log('receive data is',  event.data)
    if (event.data && event.data.type === 'GET_FB_CONFIG') {
        console.log('init backgroud firebase')
        const firebaseConfig = event.data.data
        console.log('firebaseConfig', firebaseConfig)
        firebase.initializeApp(firebaseConfig);
        const messaging = firebase.messaging();
        messaging.onBackgroundMessage(function(payload) {
          console.log('[firebase-messaging-sw.js] Received background message ', payload);
          // Customize notification here
          const { title, body, image } = payload.notification;
          /* eslint-disable-next-line */
          const notificationTitle = title;
          const notificationOptions = {
            body,
            icon:image,
          };
        
          self.registration.showNotification(notificationTitle,
            notificationOptions);
        });
    }
});