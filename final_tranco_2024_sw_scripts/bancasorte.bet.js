/**
 * A atualização de versão do cache está definida em dois arquivos (sw.js e MainController.php)
 * Para que as versões anteriores sejam deletadas do Cache Storage do navegador é necessário deixar
 * as versões dos dois arquivos IGUAIS.
 *
 * @type {string}
 */
const VERSION = "3.2.15"; //=> ALTERAR MainController.php

const CACHE_NAME = "app-cache-v".concat(VERSION);

const OFFLINE_URL = "/offline.phtml";

const URL_JS_CACHE = [
    "/sw.js",
    "/public/lib/jquery/jquery.min.js",
    "/public/lib/jquery-ui/jquery-ui.js",
    "/public/img/favicon/manifest.json",
    "/public/css/e404.min.css",
    "/public/img/generic/tela_manutecao.jpg",
];

const URL_HTML_CACHE = [OFFLINE_URL];

const urlsToCache = [].concat(URL_JS_CACHE).concat(URL_HTML_CACHE);

self.addEventListener("install", function(event) {
    self.skipWaiting();
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we needoffline.html
            // to clone the response.
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest)
                .then(async function(response) {
                    // Check if we received a valid response
                    if (!response ||
                        response.status !== 200 ||
                        response.type !== "basic" ||
                        event.request.destination == "empty" ||
                        event.request.destination == "document" //não faz cache da páginas
                    ) {
                        return response;
                    }

                    if (
                        event.request.url.indexOf(".js") < 0 &&
                        event.request.url.indexOf(".css") < 0 &&
                        event.request.url.indexOf(".png") < 0 &&
                        event.request.url.indexOf(".jpg") < 0
                    ) {
                        // só faz cache de js,css, png e jpg
                        return response;
                    }

                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseToCache).catch(function(ex) {});
                    });

                    return response;
                })
                .catch(async function(e) {
                    console.log("RequestMode: " + event.request.mode);
                    if (
                        event.request.mode === "navigate" ||
                        event.request.mode === "no-cors"
                    ) {
                        const cache = await caches.open(CACHE_NAME);
                        const cachedResponse = cache.match(OFFLINE_URL);
                        return cachedResponse;
                    }
                });
        })
    );
});