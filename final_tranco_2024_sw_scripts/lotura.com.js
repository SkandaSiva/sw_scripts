var fecha;
 
var CACHE_STATIC_NAME = 'static-v1';

var CACHE_DYNAMIC_NAME = 'dynamic';

var STATIC_FILES = [

    '/',

    '/noconexion.htm',

    '/js/jquery.min.js',

    '/js/bootstrap.bundle.min.js',

    '/js/headroom.min.js',

    '/js/cookie.js',

    '/js/gsap.min.js',

    '/js/ScrollTrigger.min.js',

    '/css/bootstrap.min.css',

    '/css/imprimatu.css',

    '/img/taldea-t.jpg',

    '/img/taldea.jpg',

    '/img/favicon-180x180.png'

];

// Caché estática

self.addEventListener("install", function (event) {

    console.log("[Service Worker] Instalando el Service Worker...", event);

    event.waitUntil(caches.open(CACHE_STATIC_NAME)

        .then(function (cache) {

            console.log("[Service Worker] Precacheando el shell de la app");

            cache.addAll(STATIC_FILES);

        })

    )

});

self.addEventListener("activate", function (event) {

    console.log("[Service Worker] Activando el Service Worker...", event);

    // Recoge la fecha actual

    var d = new Date();

    fecha = d.getTime();

    event.waitUntil(

        caches.keys()

        .then(function (keyList) {

            return Promise.all(keyList.map(function (key) {

                if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {

                    console.log('[Service Worker] Borrando cache dinamico', key);

                    return caches.delete(key);

                }

            }));

        })

    );

    return self.clients.claim();

});

// Caché dinámica

self.addEventListener("fetch", function (event) {

    event.respondWith(

        caches.match(event.request)

        .then(function (response) {

            if (response) {

                var d = new Date();

                fechaActual = d.getTime();

                // 24h después se borra la caché

                if (fechaActual > fecha + 86400000) {

                    // La caché se borra a la semana

                    //if(fechaActual > fecha + 604800000) {

                    fecha = fechaActual;

                    event.waitUntil(

                        caches.keys()

                        .then(function (keyList) {

                            return Promise.all(keyList.map(function (key) {

                                if (key === CACHE_DYNAMIC_NAME) {

                                    return caches.delete(key);

                                }

                            }));

                        })

                    );

                }

                return response;

            } else {

                return fetch(event.request)

                    .then(function (res) {

                        return caches.open(CACHE_DYNAMIC_NAME)

                            .then(function (cache) {

                                //cache.put(event.request.url,res.clone());

                                if (event.request.method === "GET" && event.request.destination === "image") {

                                    cache.put(event.request.url, res.clone());

                                }

                                return res;

                            })

                    })

                    .catch(function (err) {

                        return caches.open(CACHE_STATIC_NAME)

                            .then(function (cache) {

                                if (event.request.headers.get('accept').includes('text/html')) {

                                    return cache.match('/noconexion.htm');

                                }

                            })

                    });

            }

        })

    );

});