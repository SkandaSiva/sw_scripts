if (self.location.hostname != "localhost" && self.location.hostname != "127.0.0.1") {

    var prefixedCaches = {}

    function fetchBuild(url) {
        var uri = url ? new URL(url) : undefined
        var prefixpos = uri ? uri.pathname.indexOf("/jsnew") : -1
        var prefixNoCol = prefixpos < 0
            ? ""
            : uri.pathname.substring(0, prefixpos + 6);
        var prefix = prefixNoCol + ":"

        var prefixedCache = prefixedCaches[prefix]

        if (prefixedCache == undefined)
            prefixedCache = prefixedCaches[prefix] = [undefined, undefined, undefined]

        var dt = new Date().getTime()
        if (!prefixedCache[0] || prefixedCache[1] + 300000 < dt) {
            prefixedCache[0] = fetch(prefixNoCol + "/build", { cache: "no-store" }).then(function (res) {
                if (!res.ok) return
                return res.text().then(function (ver) {
                    if (!ver || prefixedCache[2] == ver) return
                    prefixedCache[2] = ver
                    self.caches.keys().then(function (keyList) {
                        for (var i = 0; i < keyList.length; i++)
                            if ((keyList[i].startsWith(prefix) && !keyList[i].endsWith(ver)) || keyList[i].indexOf(":") == -1)
                                self.caches.delete(keyList[i])
                    })
                })
            })
            prefixedCache[1] = dt
        }

        return prefixedCache
    }

    self.addEventListener("fetch", function (evt) {
        if (!/^get$/i.test(evt.request.method) ||
            !evt.request.url.startsWith(self.location.origin)) return

        var prefixedCache = fetchBuild(evt.request.url)

        evt.respondWith(
            self.caches.match(evt.request).then(function (c) {
                if (c) return c;
                return fetch(evt.request).then(function (r) {
                    if (prefixedCache && /^(text\/(html|css))|(image\/.*)|(font\/.*)|(application\/javascript)(;|$)/i.test(r.headers.get("content-type") || "")) {
                        var cloned = r.clone()
                        prefixedCache[0].then(function () {
                            if (!prefixedCache[2]) return
                            self.caches.open(prefixedCache[2]).then(function (cache) {
                                cache.put(evt.request, cloned)
                            })
                        })
                    }

                    return r
                })
            })
        )
    })

    self.addEventListener('push', function (evt) {
        evt.waitUntil(self.registration.showNotification("ToMojDom.pl", {
            title: "ToMojDom.pl",
            body: evt.data.text(),
            icon: "/icons/android-chrome-192x192.png",
            actions: [
                { action: "verify", title: "Sprawdź" }
            ]
        }))
    })

    self.addEventListener('notificationclick', function (evt) {
        if (evt.action !== undefined && evt.action != "verify") return;

        evt.notification.close();

        evt.waitUntil(
            clients.matchAll({ type: "window" }).then(function (cl) {
                for (var i = 0; i < cl.length; i++) {
                    if (cl[i].frameType == "top-level" && cl[i].focus)
                        return cl[i].focus();
                }
                if (clients.openWindow)
                    return clients.openWindow('https://tomojdom.pl/#src=notify')
            })
        )
    })
}