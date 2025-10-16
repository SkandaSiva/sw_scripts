const staticDevCoffee = "FilterBlade"

// these are for offline mode, which is currently not enabled, so these have seemingly no effect
// -> WILDCARDS DONT SEEM TO WORK! we had this deployed with "/datafiles/*" and it caused a lot of 4XX on the frontend S3
const assets = [
    // "/datafiles/*",
    // "/index.html",
    // "/css.min.css",
    // "/filterblade.min.js",
    // "/assets/*",
    // "/FAQ",
    // "/Contact",
    // "/ErrorPage",
    // "/favicon.ico",
    // "/libs.min.js",
    // "/Profile",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticDevCoffee).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})