importScripts('/js/workbox/workbox-v7.0.0/workbox-sw.js');

workbox.setConfig({
    //debug: true
});

workbox.loadModule('workbox-expiration');
workbox.loadModule('workbox-strategies');

workbox.core.skipWaiting();
workbox.core.clientsClaim();

const CLEAN_ALL = true;

self.addEventListener('activate', (event) => {
    // Specify allowed cache keys
    const cacheAllowList = [
        'wg-runtime-php-cache',
        'wg-priority-external-js-css-cache',
        //'wg-external-js-css-cache',
        'wg-windguru-js-css-cache',
        'wg-runtime-starturl-cache',
        'wg-runtime-startbase-cache',
        'wg-runtime-iapi-cache',
        'wg-runtime-fcst-cache',
        'wg-runtime-wgimg-cache',
        'wg-runtime-wgimg-cdn-cache',
        'wg-maptiler-other-cache',
        'wg-fonts-cache',
        'wg-maptiler-tiles-cache',
    ];

    event.waitUntil(caches.keys().then((keys) => {
        return Promise.all(keys.map((key) => {
            if (!cacheAllowList.includes(key) || CLEAN_ALL) {
                return caches.delete(key);
            }
        }));
    }));

});

workbox.routing.registerRoute(
    /\/onlinetest.php/,
    new workbox.strategies.NetworkOnly()
);

workbox.routing.registerRoute(
    /https:\/\/(fonts.googleapis.com|fonts.gstatic.com)/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'wg-fonts-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60,
                purgeOnQuotaError: true
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /https:\/\/api.maptiler.com\/tiles\/.*(H0CVk3ugbArAT7R16QhB|qIrAM6kXLBc3O7OoUAUK|gmtDMYf1MjnnWS0A7gvl)/,
    new workbox.strategies.CacheFirst({ // ZDE cache first!
        cacheName: 'wg-maptiler-tiles-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 2000,
                maxAgeSeconds: 7 * 24 * 60 * 60,
                purgeOnQuotaError: true
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /https:\/\/api.maptiler.com\/.*/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'wg-maptiler-other-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 200,
                maxAgeSeconds: 7 * 24 * 60 * 60,
                purgeOnQuotaError: true
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /https:\/\/(www|beta|dev|stations).windguru.net\/(img|img_old|images)\/.*\.(jpg|png|webp|svg|gif)/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'wg-runtime-wgimg-cdn-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 300,
                purgeOnQuotaError: true
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /\/(img|img_old|images)\/.*\.(jpg|png|webp|svg|gif)/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'wg-runtime-wgimg-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 300,
                purgeOnQuotaError: true
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /iapi\.php.*(q=forecast_spot|q=forecast_set)/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'wg-runtime-fcst-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60,
                purgeOnQuotaError: true
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /iapi\.php/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'wg-runtime-iapi-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 400,
                maxAgeSeconds: 7 * 24 * 60 * 60,
                purgeOnQuotaError: true
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /windguru.cz\/+$/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'wg-runtime-startbase-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 100,
                purgeOnQuotaError: true
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /windguru.cz\/*(station\/|\?set=|\?gn=)*[0-9]*$/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'wg-runtime-starturl-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 200,
                purgeOnQuotaError: true
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /https:\/\/(kisna-www|www|beta|dev|stations)*\.*windguru\.(net|cz|com|guru|eu)+\/.*\.(js|css)/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'wg-windguru-js-css-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 300,
                maxAgeSeconds: 10 * 24 * 60 * 60,
                purgeOnQuotaError: true
            }),
        ],
    })
);

workbox.routing.registerRoute(
    // RegExp to match URLs for external scripts and styles
    /https:\/\/.*(unpkg|gstatic|jsdelivr)+\..+\/.*\.(js|css)/,
    // Use NetworkFirst strategy
    new workbox.strategies.NetworkFirst({
        cacheName: 'wg-priority-external-js-css-cache',
        plugins: [
            // Use ExpirationPlugin to control cache entries
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 200,
                maxAgeSeconds: 10 * 24 * 60 * 60, // 10 days
                purgeOnQuotaError: true
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /\.php/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'wg-runtime-php-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 200,
                purgeOnQuotaError: true
            }),
        ],
    })
);

importScripts('https://www.gstatic.com/firebasejs/8.6.7/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.7/firebase-messaging.js');


var firebaseConfig = {
    apiKey: "AIzaSyDwc6isuJ-h__wL8NbBgRvIYuJ_IoG1ubM",
    authDomain: "windguru-1091.firebaseapp.com",
    databaseURL: "https://windguru-1091.firebaseio.com",
    projectId: "windguru-1091",
    storageBucket: "windguru-1091.appspot.com",
    messagingSenderId: "902500120979",
    appId: "1:902500120979:web:a7efad9f42ee4839a69066",
    measurementId: "G-2NEY9YDWMB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let messaging;
try {
    messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
        console.log(
            '[firebase-messaging-sw.js] Received background message ',
            payload
        );
        // Customize notification here
        /*
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
            body: 'Background Message body.',
            icon: '/firebase-logo.png'
        };

        self.registration.showNotification(notificationTitle, notificationOptions);*/
    });


} catch (err) {
    console.log(err);
}

