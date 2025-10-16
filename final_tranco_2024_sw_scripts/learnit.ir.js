const CACHE_NAME = "learnit_offline"
const ASSET_URL = "/offline/"
const OFFLINE = `${ASSET_URL}index.html`
const URLS = [OFFLINE, `${ASSET_URL}style.css`, `${ASSET_URL}cne.jpg`]
const OFFLINE_VERSION = 2

function updateActivationHandler() {
    self.addEventListener("activate", () => {
        self.clients.matchAll({type: "window"}).then((t) => {
            t.forEach((t) => {
                t.postMessage({type: "RELOAD"})
            })
        })
    })
    self.skipWaiting()
}

self.addEventListener("install", (t) => {
    t.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((e) => e.addAll(URLS.map((e) => new Request(e, {cache: "reload"}))))
            .catch((e) => {
                console.warn(t)
                console.trace(e)
            })
    )
    self.skipWaiting()
})

self.addEventListener("activate", () => {
    self.clients.claim()
})

self.addEventListener("message", (t) => {
    if (t.data && "SKIP_WAITING" === t.data.type) updateActivationHandler()
})

self.addEventListener("fetch", (e) => {
    "navigate" === e.request.mode &&
        e.respondWith(
            Promise.resolve(e.preloadResponse)
                .then((t) => t || fetch(e.request))
                .catch(() => caches.open(CACHE_NAME).then((e) => e.match(OFFLINE)))
        ),
        /http:\/\/localhost:3001\/offline\/.*|https:\/\/lab.learnit.ir\/offline\/.*|https:\/\/learnit.ir\/offline/.test(
            e.request.url
        ) &&
            e.respondWith(
                caches
                    .open(CACHE_NAME)
                    .then((t) => t.match(e.request.url))
                    .catch((t) => t || fetch(e.request))
            )
})
