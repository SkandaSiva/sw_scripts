var swName = "1655796091"; //timestamp

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches
            .open(swName)
            .then(function (cache) {
                return cache.addAll([
                    '/',
                    '/scripts/script.js',
                    '/sw.js',
                    '/css/style.css'
                ]);
            })
    );
});

//self.addEventListener('activate', event => {
//    event.waitUntil(self.clients.claim());
//});

caches.keys().then(function (names) {
    for (let name of names) {
        if (name !== swName) {
            caches.delete(name);
        }
    }
});

self.addEventListener("fetch", function (event) {
    if (event.request.url.includes("/umbraco") || event.request.url.includes("localhost") || event.request.url.includes("/free-trial") || event.request.url.includes("/pricing")) {
        return false;
    }
    if (event.request.method === 'GET') {
        event.respondWith(
            caches
                .match(event.request)
                .then(function (cached) {
                    var networked = fetch(event.request)
                        .then(fetchedFromNetwork, unableToResolve)
                        .catch(unableToResolve);
                    return cached || networked;
                    function fetchedFromNetwork(response) {
                        var cacheCopy = response.clone();
                        caches
                            .open(swName)
                            .then(function add(cache) {
                                cache.put(event.request, cacheCopy);
                            });
                        return response;
                    }
                    function unableToResolve() {
                        return new Response('<div style="max-width: 1170px; margin: 20px auto"> <div> <a href="/"> <img src="/media/xdnntudx/queue-it-logo.png" alt="Queue-it logo"> </a> </div><div style="text-align: center;"> <h2>Ooops! Service unavailable...</h2> <h4>Please check you internet connection.</h4> </div></div>', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/html'
                            })
                        });
                    }
                })
        );
    }
});
