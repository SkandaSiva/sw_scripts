const lotArtPWA = "lotart-pwa-v1"

let assets = []

assets = ["https://www.lot-art.com/412.98a05d82.js","https://www.lot-art.com/index.44fb5ccd.js","https://www.lot-art.com/runtime.ec2b70cf.js","https://www.lot-art.com/412.ca54306c.css","https://www.lot-art.com/index.f3fd8733.css","https://www.lot-art.com/images/logo.png"];
//{{INSERT_ASSETS_ABOVE_THIS_LINE}}

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(lotArtPWA).then(cache => {
            cache.addAll(assets)
        })
    )
})