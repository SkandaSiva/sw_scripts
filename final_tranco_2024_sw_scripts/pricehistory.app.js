const CacheName = 'PriceHistoryappV2';
const FilesToCatch = [''];
const AlterSearchRequestDomain = ["dl.flipkart.com"]
// const FilesToCatch = ['https://pricehistory.app/'];
const offlineCache = 'https://pricehistory.app/offline.html';
self.addEventListener('install', e => {
    e.waitUntil(caches.open(CacheName).then(cache => {
        cache.addAll(FilesToCatch).then(() => self.skipWaiting())
    }));
})
self.addEventListener('activate', e => {
    console.log('Service Worker - Activated')
    e.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cache => {
            if (cache !== CacheName) {
                console.log('Service Worker: Clearing Old Cache');
                return caches.delete(cache);
            }
        }))
    }));
});
self.addEventListener('fetch', e => {
    // console.log("request", e.request)

    // console.log("request", e.request)
    // console.log('Service Worker: Fetching');
    // const RequestURL = new URL(e.request.url)

    // if (e.request.method == "POST" && RequestURL.pathname.toString().includes("/api/search") && AlterSearchRequestDomain.includes(RequestURL.hostname)) {
    //     e.respondWith(ManageSearchRequest(e).then(function (response) {
    //         return response;
    //     }).catch(function () {
    //         return Response(JSON.stringify({ status: false, message: "Failed to load page!" }), {
    //             status: 200,
    //             headers: { "Content-Type": "application/json" },
    //         });
    //     }))
    // } else {
    e.respondWith(fetch(e.request).then(function (response) {
        return caches.open(CacheName).then(function (cache) {
            if (e.request.method == "GET") {
                cache.put(e.request, response.clone());
            }
            return response;
        })
    }).catch(function () {
        return caches.match(e.request).then(function (res) {
            if (res === undefined) {
                return caches.match(offlineCache)
            }
            return res;
        });
    }))
    // }
});

async function ManageSearchRequest(e) {
    // console.log("ManageSearchRequest")
    const body = await e.request.body;
    var json = {}
    try {
        json = JSON.parse(await body.text())
    } catch (error) {
        // console.log("parse error", error)
    }
    // console.log("/api/search")
    if ("url" in json && json.url.length > 0) {
        try {
            const BodyUrl = new URL(json.url)
            // console.log("BodyUrl", BodyUrl.toString())
            if (BodyUrl.hostname == "dl.flipkart.com") {
                var UnShort = await fetch(BodyUrl.toString(), {
                    redirect: 'follow',
                    method: "GET"
                })

                // console.log("UnShort", UnShort)

                if (UnShort.redirected) {
                    e.request.body = JSON.stringify({ url: UnShort.url.toString().replace("http://", "https://").replace("dl.flipkart.com", "www.flipkart.com").replace("/dl/", "/") })
                }
            }
        } catch (error) {
            // console.log("error", error)
        }
    } else {
        // console.log("Invalid url!")
    }

    return await fetch(e.request)
}