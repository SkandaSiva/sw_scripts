var staticCaches = ["carrosp-cache-v1"];

function inArray(b, c) { return 0 < b.filter(function (a) { return a === c }).length ? !0 : !1 };

self.addEventListener("install", function (event) {
    console.log("SW: Instalado e atualizado");
    event.waitUntil(
        caches.open(staticCaches).then(function (cache) {
            return fetch("/sw-resources.json", { mode: "no-cors" })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Falha na rede ao tentar acessar sw-resources.json');
                    }
                    return response.json();
                })
                .then(function (files) {
                    console.log("SW: Cacheando recursos...");
                    return cache.addAll(files);
                })
                .catch(function (error) {
                    console.error("SW: Falha ao buscar sw-resources.json", error);
                });
        })
    );
    self.skipWaiting();
});

self.addEventListener("fetch", function (event) {

    if (event.request.url.startsWith('http')) {
        event.respondWith(
            fetch(event.request).then(function (response) {

                var url = event.request.url;
                
                if (404 == response.status || (url.indexOf("carrosp") == -1) ) return response;

                return response;

            }).catch(function (error) {
                console.log("Offline mode.");
                // Tenta encontrar uma correspond�ncia no cache para a requisi��o falha
                return caches.match(event.request).then(function (cacheResponse) {
                     // Se a requisi��o falhar, tentamos encontrar uma correspond�ncia no cache
                        return cacheResponse || new Response('Offline', { status: 503, statusText: 'Offline' });
                });
            })
        );
    }

});