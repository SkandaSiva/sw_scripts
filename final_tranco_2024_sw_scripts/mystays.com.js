var cacheVersion = 'version-1';


importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyDcIaWgXYCAliviJZ1KocQgHpRg1GpCoQM",
    authDomain: "mystays-push-notifications.firebaseapp.com",
    databaseURL: "https://mystays-push-notifications.firebaseio.com",
    projectId: "mystays-push-notifications",
    storageBucket: "mystays-push-notifications.appspot.com",
    messagingSenderId: "885210096703",
    appId: "1:885210096703:web:8f08cec69a18bfab86448a",
    measurementId: "G-KK5P08R2XY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/Assets/Mystays/images/mystays-logo.png',
        image: '/Assets/Mystays/images/mystays-logo512.png',
        badge: '/Assets/Mystays/images/mystays-logo256.png'
    };

    return self.registration.showNotification(notificationTitle,notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
    console.log('On notification click: ', event.notification.tag);
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == '/' && 'focus' in client)
                return client.focus();
        }
        if (clients.openWindow)
            return clients.openWindow('/');
    }));
});

//var cachefiles = ['/', '/en-us/', '/ko-kr/', '/zh-cn/', '/zh-tw/', '/en-us/hotels/', '/hotels/', '/zh-cn/hotels/', '/zh-tw/hotels/', '/ko-kr/hotels/',
//    '/-/media/Mystays/Global/Header/logo.svg', '/-/media/Mystays/Global/Header/Flags/flag-english.svg', '/-/media/Mystays/Global/Header/Flags/flag-japan.svg'
//    , '/-/media/Mystays/Global/Header/Flags/flag-china.svg', '/-/media/Mystays/Global/Header/Flags/flag-taiwan.svg', '/-/media/Mystays/Global/Header/Flags/flag-korea.svg',
//    '/Assets/Mystays/scripts/script_Mystays_en.js', '/Assets/Mystays/scripts/script_Mystays_ja-JP.js', '/-/media/Mystays/Home/Hero-Banner/desktop.jpg',
//    '/-/media/mystays/home/hero-banner/desktop.jpg', '/-/media/mystays/home/hero-banner/tablet.jpg', '/-/media/Mystays/Home/Hero-Banner/tablet.jpg',
//    '/-/media/Mystays/Reusable/Brands/art-hotel.png', '/-/media/Mystays/Reusable/Brands/mystays.png', '/-/media/Mystays/Reusable/Brands/flexstay.png',
//    '/-/media/Mystays/Reusable/Brands/my-cube.png', '/Assets/Mystays/images/heart-ico.png', '/Assets/Mystays/images/svg-icons.svg', '/Assets/Mystays/favicon.ico',
//    '/-/media/Mystays/Global/Footer/1.svg', '/-/media/Mystays/Global/Footer/2.svg', '/-/media/Mystays/Global/Footer/3.svg', '/-/media/Mystays/Global/Footer/4.svg',
//    '/Assets/Mystays/images/lazyload/lazyload1.jpg',
//    '/Assets/Mystays/images/weather-icons.svg', '/Assets/mystays/images/lazyload/lazyload1.jpg', '/Assets/mystays/images/lazyload/lazyload2.jpg',
//    '/Assets/Mystays/fonts/slick.woff', '/Assets/Mystays/fonts/slick.ttf',
//    '/Assets/Mystays/images/loader.gif', '/Assets/Mystays/scripts/coreJs.js', '/Assets/Mystays/scripts/script_Mystays_ko-KR.js', '/Assets/Mystays/scripts/script_Mystays_zh-CN.js', '/Assets/Mystays/scripts/script_Mystays_zh-TW.js', '/Assets/Mystays/styles/css_Mystays_en.css', '/Assets/Mystays/styles/css_Mystays_ja-JP.css', '/Assets/Mystays/styles/css_Mystays_ko-KR.css', '/Assets/Mystays/styles/css_Mystays_zh-CN.css', '/Assets/Mystays/styles/css_Mystays_zh-TW.css', '/Assets/Mystays/fonts/icomoon.ttf', '/Assets/Mystays/fonts/Lato-Black.woff', '/Assets/Mystays/fonts/Lato-Bold.woff', '/Assets/Mystays/fonts/Lato-Light.woff', '/Assets/Mystays/fonts/Lato-Medium.woff', '/Assets/Mystays/fonts/Lato-Regular.woff', '/Assets/Mystays/fonts/fontawesome-webfont.woff', '/Assets/Mystays/svg/sprite.svg'];
var cachefiles = ['/Assets/Mystays/images/heart-ico.png', '/-/media/Mystays/Home/Hero-Banner/desktop.jpg', '/-/media/mystays/home/hero-banner/tablet.jpg'];
var cacheByLanguageFiles = ['/hotels'];
var offLineFile = '/';
var offlineImage =
    '<svg role="img" aria-labelledby="offline-title"' +
    ' viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' +
    '<title id="offline-title">Offline</title>' +
    '<g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/>' +
    '<text fill="#9B9B9B" font-family="Times New Roman,Times,serif" font-size="72" font-weight="bold">' +
    '<tspan x="93" y="172">offline</tspan></text></g></svg>';
var shoudNotCache = ['/layouts/system/', '/api/', '/ajax/', '.mp4', 'log.optimizely.com'];
var language = getCurrentLanguage(self.location.href);
var currentLanguage = language;

function getCurrentLanguage(url) {
    var host = url.toLowerCase();
    var lang = "";
    if (host.indexOf('/en-us') !== -1) {
        lang = "en-us";
    }
    else if (host.indexOf('/zh-cn') !== -1) {
        lang = "zh-cn";
    }
    else if (host.indexOf('/zh-tw') !== -1) {
        lang = "zh-tw";
    }
    else if (host.indexOf('/ko-kr') !== -1) {
        lang = "ko-kr";
    }

    return lang;
}
function addToCache(cacheKey, request, response, resourceType) {
    if (response.ok || request.url.indexOf('cloudfront.net') !== -1) {
        if (request.url.indexOf('cloudfront.net') === -1) {
            var requestUrl = new URL(request.url);
            if (requestUrl.origin !== self.location.origin) {
                return response;
            }
        }

        if (request.url.toLowerCase().indexOf('script_mystays_ja-jp-min') !== -1) {
            var a = 1;
        }

        var copy = response.clone();

        if (request.url.indexOf('cloudfront.net') !== -1) {
            if (request.url.indexOf('.svg') !== -1 ||
                request.url.indexOf('.css') !== -1
                || request.url.indexOf('.js') !== -1
                || request.url.indexOf('.ttf') !== -1
                || request.url.indexOf('.woff') !== -1
            ) {
                var reqUrl = request.url.substring(request.url.indexOf('cloudfront.net') + 14);
                if (reqUrl.indexOf('//') === 0) {
                    reqUrl = reqUrl.substring(1);
                }
                var req = new Request(reqUrl);
                //Try to fetch from cache
                caches.match(req, { ignoreSearch: true }).then(cacheResponse => {
                    if (!cacheResponse) {
                        fetch(req).then(newResponse => {
                            caches.open(cacheKey).then(cache => {
                                cache.put(req, newResponse);
                            });
                        });
                    } else {
                        if (req.url.toLowerCase() != cacheResponse.url.toLowerCase()) {
                            caches.open(cacheKey).then(cache => {
                                var cacheRes = new URL(cacheResponse.url);
                                cache.delete(cacheRes.pathname + cacheRes.search).then((result) => {
                                    fetch(req).then(newResponse => {
                                        caches.open(cacheKey).then(cache => {
                                            cache.put(req, newResponse);
                                        });
                                    });
                                })
                            })
                            
                        }
                    }
                });
            }
        } else {
            //Try to fetch from cache
            caches.match(request, { ignoreSearch: true }).then(cacheResponse => {
                if (!cacheResponse) {
                   
                    if (request.url.indexOf('.svg') !== -1 ||
                        request.url.indexOf('.css') !== -1
                        || request.url.indexOf('.js') !== -1
                        || request.url.indexOf('.ttf') !== -1
                        || request.url.indexOf('.woff') !== -1
                    ) {
                        caches.open(cacheKey).then(cache => {
                            cache.put(request, copy);
                        });
                    }
                } else {
                    if (request.url.toLowerCase() != cacheResponse.url.toLowerCase()) {
                        caches.open(cacheKey).then(cache => {
                            var cacheRes = new URL(cacheResponse.url);
                            cache.delete(cacheRes.pathname + cacheRes.search).then((result) => {
                                if (request.url.indexOf('.svg') !== -1 ||
                                    request.url.indexOf('.css') !== -1
                                    || request.url.indexOf('.js') !== -1
                                    || request.url.indexOf('.ttf') !== -1
                                    || request.url.indexOf('.woff') !== -1
                                ) {
                                    caches.open(cacheKey).then(cache => {
                                        cache.put(request, copy);
                                    });
                                }
                            })
                        })
                        
                    }}
            });
        }
    }
    return response;
}

function fetchFromCache(event, resourceType) {
    return caches.match(event.request).then(response => {
        if (!response) {
            throw Error(`${event.request.url} not found in cache`);
        }

        return response;
    });
}

function offlineResponse(resourceType) {
    if (resourceType === 'image') {
        return new Response(offlineImage,
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    } else if (resourceType === 'html') {
        return caches.match(offLineFile);
    }
    return undefined;
}

//Adding 'install' event handler to add cache files
//self.addEventListener('install', function (event) {
//    function onInstall(event) {
//        var cacheKey = cacheVersion;
//        return caches.open(cacheKey).then(function (cache) {
//            //console.log('Adding cache');
//            cache.addAll(cachefiles).then(
//                function (response) {
//                    // console.log('adding');

//                }).catch(function (err) {
//                    //  console.log(err);
//                });

//            cache.add(offLineFile).then(
//                function (response) {
//                    //console.log('adding');
//                }).catch(function (err) {
//                    //console.log(err);
//                });

//            for (var i = 0; i < cacheByLanguageFiles.length; i++) {
//                var url = "/" + currentLanguage + cacheByLanguageFiles[i] + "/";
//                if (url.indexOf('//') === 0) {
//                    url = url.substring(1);
//                }
//                cache.add(url).then(
//                    function (response) {
//                        //console.log('adding');
//                    }).catch(function (err) {
//                        //console.log(err);
//                    });
//            }
//        });
//    }
//    event.waitUntil(
//        onInstall(event).then(() => self.skipWaiting())
//    );
//});


function onFetch(event) {
    var request = event.request;
    var acceptHeader = request.headers.get('Accept');
    var resourceType = 'static';
    var cacheKey;

    if (acceptHeader.indexOf('image') !== -1) {
        resourceType = 'image';
    }

    //if (request.) {

    //}

    cacheKey = cacheVersion;


    event.respondWith(
        fetchFromCache(event, resourceType)
            //Not present in cahce then respond with fetch request
            .catch(() =>
                fetch(request)
            )
            //Present in cache then try to add
            .then(response =>
                addToCache(cacheKey, request, response, resourceType)
            ).catch(err => console.log(err))

        //.catch(() =>
        //    //offlineResponse(resourceType)
        //)
    );

}

function shouldHandleFetch(event) {
    var request = event.request;

    //Ignore HTML files
    if (request.headers.get('Accept').indexOf('text/html') !== -1) {
        return false;
    }
    //var url = new URL(request.url);
    var criteria = {
        //matchesPathPattern: opts.cachePathPattern.test(url.pathname),
        isGETRequest: request.method === 'GET',
        //isFromMyOrigin: url.origin === self.location.origin
    };

    var failingCriteria = Object.keys(criteria)
        .filter(criteriaKey => !criteria[criteriaKey]);

    //Not a GET request
    var result = !failingCriteria.length;
    if (!result) {
        return false;
    }

    for (var i = 0; i < shoudNotCache.length; i++) {
        if (request.url.indexOf(shoudNotCache[i]) !== -1) {
            result = false;
            break;
        }
    }

    return result;
}

//self.addEventListener("fetch", function (event) {

//    if (shouldHandleFetch(event)) {
//        onFetch(event);
//    }
//});



// self.addEventListener('fetch', function(event) {
//     //console.log('[demoPWA - ServiceWorker] Fetch event fired.', event.request.url);
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             if (response) {
//               //  console.log('[demoPWA - ServiceWorker] Retrieving from cache...');
//                 return response ;
//             }
//             // else {
//             //     console.log('Returning from offline cache file');
//             //     caches.match(event.request);
//             // }
//             return fetch(event.request).catch(function (event) {
//                //you might want to do more error checking here too,
//                //eg, check what e is returning..               
//             });
//         })
//     );
// });



function onActivate(event) {
    return caches.keys()
        .then(cacheKeys => {
            var oldCacheKeys = cacheKeys.filter(key => key.indexOf(cacheVersion) !== 0);
            var deletePromises = oldCacheKeys.map(oldKey => caches.delete(oldKey));
            console.log('[ServiceWorker] Removing old cache', oldCacheKeys);
            return Promise.all(deletePromises);
        });
}

//self.addEventListener('activate', function (event) {
//    console.log('[ServiceWorker] Activate');
//    event.waitUntil(
//        onActivate(event)
//            .then(() => self.clients.claim())
//    );
//});



// self.addEventListener("push", function(event) {

//     event.waitUntil(

//         fetch("http://localhost/api/getNotification", {
//             method: "get",
//             headers: {
//                 "Accept": "application/json",
//                 "Content-Type": "application/json"
//             }
//         }).then(function(response) {
//             return response.json()
//         }).then(function(result) {
//             //set the url action
//             urlAction = result.msg.data.action;
//             self.registration.showNotification(result.msg.data.title, {
//                 body: result.msg.data.msg,
//                 icon: result.msg.data.logo,
//                 tag: result.msg.data.name
//             });

//         })
//     )
// });



// self.addEventListener("notificationclick", function(event) {

//     // close the notification
//     event.notification.close();

//     //To open the app after click notification
//     event.waitUntil(
//         clients.matchAll({
//             type: "window"
//         })
//         .then(function(clientList) {
//             for (var i = 0; i < clientList.length; i++) {
//                 var client = clientList[i];
//                 if ("focus" in client) {
//                     return client.focus();
//                 }
//             }

//             if (clientList.length === 0) {
//                 if (clients.openWindow) {
//                     return clients.openWindow(urlAction);
//                 }
//             }
//         })
//     );
// });