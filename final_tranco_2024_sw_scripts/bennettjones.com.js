var staticFiles = [
  "/",
  "/offline.html",
  "/Scripts/library/jquery.min.js",
  "/Scripts/library/bootstrap.min.js",
  "/Styles/library/bootstrap.min.css",
  "/Styles/site/site.min.css",
  "/Styles/site/site.responsive.min.css",
  "/Styles/site/site.icons.css",
  "/Styles/images/favicon.ico",
  "/Styles/images/logo_colour.svg",
  "/Styles/images/logo-apple-touch-icon-180x180.png",
  "/layouts/BennettJones/styles/images/bennettjones_pattern_web_banner_background_v1_white.png",
  "/Styles/fonts/scala-regular.eot",
  "/Styles/fonts/scala-bold.eot",
  "/Styles/fonts/scala-regular.woff2",
  "/Styles/fonts/scala-regular.ttf",
  "/Styles/fonts/scala-bold.woff2",
  "/Styles/fonts/scala-bold.woff"
];

self.addEventListener('install', function (event) {
    console.log("[Service Worker] Installing Service Worker ...", event);

    event.waitUntil(
        caches.open("bennettjones")
        .then(function (cache) {
            return cache.addAll(staticFiles);
        })
    );
});

self.addEventListener('activate', function (event) {
    console.log("[Service Worker] Activating Service Worker ...", event);

    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    
});

self.addEventListener('notificationclick', function (event) {
    var notification = event.notification;
    var action = event.action;

    //console.log("Notification click", notification);
    //console.log("Data", notification.data);

    if (notification.data.url === "") {
        notification.close();
        return;
    }

    if (action === "confirm")
        notification.close();
    else {
        event.waitUntil(
            clients.matchAll().
            then(function (clientList) {
                var client = clientList.find(function (c) {
                    return c.visibiltyState === "visible";
                });

                if (client !== undefined) {
                    client.navigate(notification.data.url);
                    client.focus();
                }
                else {
                    clients.openWindow(notification.data.url);
                }
            })
        );

        notification.close();
    }
});

self.addEventListener('notificationclose', function (event) {

});

self.addEventListener('push', function (event) {
    //console.log("[Service Worker] Push Notification received ...", event);

    var data = { title: "Bennett Jones", url: "" };

    try {
        data = event.data.json();
    }
    catch (e) {
        data["content"] = event.data.text();
    }

    if (event.data) {
        var options = {
            icon: "/Styles/images/logo-icon-96x96.png",
            badge: "/Styles/images/logo-icon-96x96.png",
            vibrate: [100, 50, 200],
            renotify: true,
            tag: "notify",
            body: data.content,
            data: data
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});