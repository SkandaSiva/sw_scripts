const CACHE_VERSION = "2.65.20";
const CACHE_NAME = "topup.co.zw-v" + CACHE_VERSION;
const CACHE_FILES = [
    "/manifest.json",
    "/bundles/earlyjs?v=" + CACHE_VERSION,
    "/bundles/earlycss?v=" + CACHE_VERSION,
    "/bundles/latejs?v=" + CACHE_VERSION,
    "/bundles/latejs2?v=" + CACHE_VERSION,
    "/bundles/mobilerecharge?v=" + CACHE_VERSION,
    "/bundles/billpay?v=" + CACHE_VERSION,
    "/",
    "/my/vouchers",
    "/my/accounts",
    "/my/contacts",
    "/my/history",
    "/home/offline",
    "/home/offlinelogout",
    "/content/offline.png",
    "/assets/images/logo/paynow/paynow-white.svg"
];

importScripts("/scripts/pwa/sw-toolbox.js");
importScripts("/scripts/pwa/sw-cachehandlers.js");

toolbox.options.debug = false;
toolbox.options.cache.name = CACHE_NAME;
toolbox.options.networkTimeoutSeconds = 5;

toolbox.precache(CACHE_FILES);

// routing request management
toolbox.router.default = toolbox.networkOnlyCustom;

toolbox.router.any("/", toolbox.networkFirst);
toolbox.router.any("/manifest.json", toolbox.cacheFirst);
toolbox.router.any("/bundles/*", toolbox.cacheFirst);
toolbox.router.any("/assets/*", toolbox.cacheFirst);
toolbox.router.any("/content/*", toolbox.cacheFirst);
toolbox.router.any("/scripts/*", toolbox.cacheFirst);
toolbox.router.any("/uploaded/*", toolbox.cacheFirst);

toolbox.router.any("/userapi/*", toolbox.userApiSync);
toolbox.router.any("/user/logout", toolbox.logoutHandler);
toolbox.router.any("/user/*", toolbox.networkOnlyCustom);
toolbox.router.any("/admin/*", toolbox.networkOnly);
toolbox.router.any("/operamini/*", toolbox.networkOnly);

toolbox.router.any("/my/paymentmethods", toolbox.networkOnly);
toolbox.router.any("/my/vouchers", toolbox.networkFirst);
toolbox.router.any("/my/accounts", toolbox.networkFirst);
toolbox.router.any("/my/contacts", toolbox.networkFirst);
toolbox.router.any("/my/history", toolbox.networkFirst);

// Ensure that our service worker takes control of the page as soon as possible.
self.addEventListener("install",
    function (event) {
        event.waitUntil(self.skipWaiting());
    });

self.addEventListener("activate",
    function (event) {
        event.waitUntil(self.clients.claim());
    });

// clear old caches
self.addEventListener("activate", function (event) {
    console.log("Checking for old caches to delete...");
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName != CACHE_NAME;
                }).map(function (cacheName) {
                    console.log("Deleting cache called " + cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// listen for notification click events
self.addEventListener("notificationclick", function (event) {
    if (event.action) {
        var action = event.notification.actions.filter(function (o) { return o.action == event.action; });
        clients.openWindow(action[0].action);
    }
});

// listen for push
self.addEventListener("push", function (event) {
    console.info("Service worker PUSH: Triggered");

    var data;
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = {
                title: "Notification from Paynow Topup",
                body: event.data.text()
            };
        }

        if (!(self.Notification && self.Notification.permission === "granted"))
            return;

        if (!data.icon)
            data.icon = "/assets/images/favicon/android-chrome-512x512.png";

        var options = {
            body: data.body,
            icon: data.icon,
            vibrate: [25, 25, 25, 25, 25, 25, 25, 25, 25, 500, 100, 500, 100], // the topup.co.zw vibe
            data: {
            }
        };

        if (data.actions)
            options.actions = data.actions;

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});