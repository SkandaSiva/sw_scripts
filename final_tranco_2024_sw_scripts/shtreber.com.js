const cacheName = "shtreber_offline";
self.importScripts("analytics-helper.js");
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(
                [
                    "Components/libs/offline.html",
                    "Components/libs/logo.svg",
                ]
            );
        })
    );
});

// eslint-disable-next-line consistent-return
self.addEventListener("fetch", event => {
    // eslint-disable-next-line no-extra-parens
    if (navigator.onLine || (event.request.method === "GET" && event.request.headers.get("accept").includes("text/html"))) {
        // return fetch(event.request);
    } else {
        event.respondWith(
            fetch(event.request.url).catch(error => {
                return caches.match("Components/libs/offline.html");
            })
        );
    }
});

self.addEventListener("push", function(e) {
    const payload = e.data ? e.data.text() : "no payload";
    const json_payload = JSON.parse(Array.isArray(payload) ? payload : [ payload ]);
    // kada nema url-a onda se korisnik salje na root sajta
    const event_url = json_payload.action_url !== undefined ? json_payload.action_url : "/";
    var options = {
        body:    json_payload.message,
        icon:    json_payload.image,
        vibrate: [ 100, 50, 100 ],
        data:    {
            dateOfArrival: Date.now(),
            primaryKey:    "2",
            url:           event_url,
        },
        actions: [
            {
                action: "close",
                title:  "Zatvori",
                icon:   "images/xmark.png",
            },
        ],
    };
    e.waitUntil(
        self.registration.showNotification(json_payload.subject, options)
    );
});

self.addEventListener("notificationclose", function(event) {
    event.waitUntil(
        sendAnalyticsEvent("close", "notification", event.notification.title, event.notification.tag)
    );
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    event.waitUntil(
        sendAnalyticsEvent("click", "notification", event.notification.title, event.notification.tag),
        clients.openWindow(event.notification.data.url)
    );
});
