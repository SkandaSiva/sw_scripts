var CACHE_STATIC_NAME = 'static-v7';
//var CACHE_DYNAMIC_NAME = CACHE_DYNAMIC_NAME_M;
//console.log(CACHE_DYNAMIC_NAME_M);
//var CACHE_DYNAMIC_NAME = 'dynamic-v' + today.getDate() + (today.getMonth() + 1) + today.getFullYear() + today.getHours() + today.getMinutes();
var CACHE_DYNAMIC_NAME;

var STATIC_FILES = [
    '/Home/Index',
    '/Scripts/appEJESA.js',
    '/Content/layoutstyles2.css',
    '/manifestEJESA.json',  
    '/structure/carousel-progress-indicator.svg',
    '/Content/Images/ayuda-2.svg',
    '/Content/Images/LOGOEJESAAZUL.png',
    '/Content/Images/telefono.svg',
    '/Content/Images/flecha.svg',
    '/Content/Images/clip.svg',
    '/Content/Images/principal.svg',
    '/Content/Images/ImagesEJESA/ejesa-como-leer-mi-factura-min.jpg',
    '/Content/Images/ImagesEJESA/ejesa-proveedores-min.jpg',
    '/Content/Images/ImagesEJESA/tercer-pueblo-solar-min.jpg',
    '/Content/Images/ImagesEJESA/ejesa-tarifas-min.jpg',
    '/Content/Images/ImagesEJESA/ejesa-alta-de-servicio-min.jpg',
    '/Content/Images/ImagesEJESA/ejesa-segundo-pueblo-solar-min.jpg',
    '/Content/Images/ImagesEJESA/slide3-min.jpg',
    'https://fonts.googleapis.com/css?family=Montserrat:200,300,400,500,600,700',
    'https://fonts.googleapis.com/css?family=Roboto:200,300,400,500,600,700',
    'https://cdn.ampproject.org/v0/amp-sidebar-0.1.js',
    'https://cdn.ampproject.org/v0/amp-form-0.1.js',
    'https://cdn.ampproject.org/v0/amp-accordion-0.1.js',
    'https://cdn.ampproject.org/v0/amp-bind-0.1.js'
]

self.addEventListener('install', function (event) {
    self.skipWaiting();
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function (cache) {
                console.log('[Service Worker] Precaching App Shell');
                cache.addAll(STATIC_FILES);
            })
    )
});

//self.addEventListener('activate', function (event) {
//    console.log("[SW]) Activando SW", event);
//    return self.clients.claim();
//});

//self.addEventListener('fetch', function (event) {
//    event.respondWith(
//        caches.match(event.request)
//        .then(function (response) {
//        if (response) {
//            return response;
//        }else{
//            return fetch(event.request)
//            .then(function (res) {
//               return caches.open('dynamic')
//                    .then(function (cache) {
//                        cache.put(event.request.url, res.clone()); 
//                        return res;
//                    })
//            });
//        }
//      })
//    );
//});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        console.log('[Service Worker] Removing old cache.', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});

fetch('./alerts/getversion')
    .then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }

            // Examine the text in the response
            response.json().then(function (data) {
                CACHE_DYNAMIC_NAME = 'dynamic-v'+data.version;
                console.log("Versión de caché actualizada");
            });
        }
    )
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    });

self.addEventListener('fetch', function (event) {

    if (event.request.url.toLowerCase().includes('/registro/Login')) {
        console.log("exceptuado registro login");
        return false;        
    }
    if (event.request.url.toLowerCase().includes('/shared/header')) {
        return false;
    }
    if (event.request.url.toLowerCase().includes('/shared/headermobile')) {
        return false;
    }
    if (event.request.url.toLowerCase().includes('/shared/headertablet')) {
        return false;
    }
    event.respondWith(
        caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
            console.log("wdofetch", CACHE_DYNAMIC_NAME);
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    
                    return response;
                 
                });
            });
        })
    );
});

//self.addEventListener('fetch', function (event) {
//    var url = 'https://cdn.agentbot.net/core/f88e1122d5e9b7519ec4e0481560eab5.js';

//    if (event.request.url.indexOf(url) > -1) {
//        event.respondWith(
//            caches.open(CACHE_DYNAMIC_NAME)
//                .then(function (cache) {
//                    return fetch(event.request)
//                        .then(function (res) {
//                            cache.put(event.request, res.clone());
//                            return res;
//                        });
//                })
//        );
//    } else {
//        event.respondWith(
//            caches.match(event.request)
//                .then(function (response) {
//                    if (response) {
//                        return response;
//                    } else {
//                        return fetch(event.request)
//                            .then(function (res) {
//                                return caches.open(CACHE_DYNAMIC_NAME)
//                                    .then(function (cache) {
//                                        cache.put(event.request.url, res.clone());
//                                        return res;
//                                    })
//                            })
//                            .catch(function (err) {
//                                return caches.open(CACHE_STATIC_NAME)
//                                    .then(function (cache) {
                                      
//                                    });
//                            });
//                    }
//                })
//        );
//    }
//});