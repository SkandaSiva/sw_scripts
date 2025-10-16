"use strict";
var getWeekNumberWithYear = function () {
    var e = new Date((new Date).getFullYear(), 0, 1);
    return (new Date).getFullYear() + "-" + Math.ceil(((new Date - e) / 864e5 + e.getDay() + 1) / 7)
},
    CACHES = {
        assets: {
            name: "acom-assets-" + getWeekNumberWithYear(),
            domains: ["fonts.googleapis.com", "fonts.gstatic", "code.jquery.com"]
        }
    },
    ASSETS = [],
    shouldBeCached = function (e, t) {
        return "string" == typeof e && t.test(e.slice(0, 60))
    };
Object.keys(CACHES).forEach(function (e) {
    CACHES[e].regexp = new RegExp("(" + CACHES[e].domains.map(escape).join("|") + ")")
});
var cacheAndNetworkFallback = function (n, t) {
    n.respondWith(caches.match(n.request).then(function (e) {
        return e || caches.open(t).then(function (t) {
            return fetch(n.request).then(function (e) {
                return t.put(n.request, e.clone()), e
            })
        })
    }))
},
    cacheAndUpdate = function (n, e) {
        n.respondWith(caches.match(n.request).then(function (e) {
            return e || fetch(n.request)
        })), n.waitUntil(caches.open(e).then(function (t) {
            return fetch(n.request).then(function (e) {
                return t.put(n.request, e.clone()).then(function () {
                    return e
                })
            })
        }))
    },
    networkThenCache = function (n, a) {
        n.respondWith(fetch(n.request).then(function (e) {
            if (!e || 200 !== e.status || "basic" !== e.type && "cors" !== e.type) return e;
            var t = e.clone();
            return caches.open(a).then(function (e) {
                e.put(n.request, t)
            }), e
        }).catch(function () {
            return caches.match(n.request)
        }))
    },
    networkThenCacheNamedQuery = function (n, a) {
        n.respondWith(fetch(n.request).then(function (e) {
            if (!e || 500 <= e.status || "basic" !== e.type && "cors" !== e.type) return e;
            if (200 === e.status) {
                var t = e.clone();
                caches.open(a).then(function (e) {
                    e.put(n.request, t)
                })
            }
            return e
        }).catch(function () {
            return caches.match(n.request)
        }))
    };
self.addEventListener("install", function (e) {
    e.waitUntil(caches.open(CACHES.assets.name).then(function (e) {
        return e.addAll(ASSETS)
    }))
}), self.addEventListener("fetch", function (e) {
    var t = e.request.url;
    if ("GET" === e.request.method) switch (!0) {
        case shouldBeCached(t, CACHES.assets.regexp):
            return cacheAndNetworkFallback(e, CACHES.assets.name);
        default:
            return
    }
}), self.addEventListener("activate", function (e) {
    var t = Object.keys(CACHES).map(function (e) {
        return CACHES[e].name
    });
    e.waitUntil(caches.keys().then(function (e) {
        return Promise.all(e.map(function (e) {
            if (-1 === t.indexOf(e)) return caches.delete(e)
        }))
    }))
});