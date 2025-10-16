const CACHE_CHECK = 'ee33c3cba2e2a9c97eb1849ac88a56ab4ce953e0'
const CACHE_VERSION = "1";
let CURRENT_CACHES = {
    offline: "offline-1",
    app: "app"
};
const OFFLINE_URL = "server_offline";

function createCacheBustedRequest(e) {
    let t = new Request(e, {
        cache: "reload"
    });
    if ("cache" in t) return t;
    let n = new URL(e, self.location.href);
    return n.search += (n.search ? "&" : "") + "cachebust=" + Date.now(), new Request(n)
}

self.addEventListener("install", e => {
    e.waitUntil(fetch(createCacheBustedRequest(OFFLINE_URL)).then(function (e) {
        return caches.open(CURRENT_CACHES.offline).then(function (t) {
            return t.put(OFFLINE_URL, e)
        })
    }))
}), self.addEventListener("activate", e => {
    let t = Object.values(CURRENT_CACHES);
    e.waitUntil(caches.keys().then(e => Promise.all(e.map(e => {
        if (-1 === t.indexOf(e)) return console.log("Deleting out of date cache:", e), caches.delete(e)
    }))))
}), self.addEventListener("fetch", e => {
    //console.log(e)
 /*   e.respondWith(
        fetch(e.request.url).catch(() => caches.match(OFFLINE_URL))
    );*/
    ("navigate" === e.request.mode || "GET" === e.request.method && e.request.headers.get("accept").includes("text/html")) &&
    e.respondWith(
        fetch(e.request)
            .catch(e => (console.log("Fetch failed; returning offline page instead.", e), caches.match(OFFLINE_URL))))

   // ("navigate" === e.request.mode || "GET" === e.request.method && e.request.headers.get("accept").includes("text/html")) && e.respondWith(caches.open(CURRENT_CACHES.app).then(t => t.match(e.request).then(n => n || fetch(e.request).then(n => (t.put(e.request, n.clone()), n)).catch(e => (console.log("Fetch failed; returning offline page instead.", e), caches.match(OFFLINE_URL))))))
});