var cdnUrl = 'https://pesweb.azureedge.net';
var assetsFileVersion = 186;
var fontFileVersion = 20210630;

var STATIC_ASSETS_CHECKSUM = "14df6e43", EXTERNAL_ASSETS_CHECKSUM = "4d4cd3fi", IMAGES_CHECKSUM = "abd70fe5";
var OFFLINE_URL = '/en/home/offline';

var BLACKLIST = [
    'https://www.facebook.com/(.)+',
    'https://(.)+.byside.com/',
    'wss://(.)+.byside.com/',
    'https://(.)+.doubleclick.net/',
    'https://(.*)google(.*).com/',
    'https://(.)+.flx1.com/',
    'https://track.adform.net/',
    'https://api.stathat.com/',
    'https://api.keen.io/',
    'https://a.volvelle.tech/',
    'https://csi.gstatic.com/',
    'https://assets.pinterest.com/',
    'https://dc.services.visualstudio.com/',
    'https://bat.bing.com/',
    'https://secure.adnxs.com/',
    'https://pixel.mathtag.com/',
    'https://connect.facebook.net/',
    'https://((www)|(secure)|(sso)).pestana((collection)|(hotelsresorts)|(cr7))?.com/',
    'https://www.pousadas.pt/',
    'https://pesweb.azureedge.net/gcs360/images/(.+)'
];

var FILES = [
     /* Webfonts */
    cdnUrl + '/assets/css/fonts/pestana_webfonts_all.woff?' + fontFileVersion,
    cdnUrl + '/assets/css/fonts/2CE53B_13_0.woff2?' + fontFileVersion,
    cdnUrl + '/assets/css/fonts/2CE53B_1B_0.woff2?' + fontFileVersion,
    cdnUrl + '/assets/css/fonts/2CE53B_19_0.woff2?' + fontFileVersion,
    cdnUrl + '/assets/css/fonts/2CE53B_1F_0.woff2?' + fontFileVersion,
    cdnUrl + '/assets/css/fonts/2CE53B_12_0.woff2?' + fontFileVersion,
    cdnUrl + '/assets/css/fonts/2CE53B_1E_0.woff2?' + fontFileVersion,
    cdnUrl + '/assets/css/fonts/2CE53B_11_0.woff2?' + fontFileVersion,
    /* CSS */
    cdnUrl + '/assets/css/release/webfonts.base.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/release/webfonts.full.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/release/homepage/all.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/release/homepage/all.mobile.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/homepage-desktop-critical.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/final/base.all.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/pestana-webfonts.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/sprites.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/main.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/units.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/units-sidebar.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/mobile-menu-migration.min.css' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/css/themes/theme-group.min.css' + '?v=' + assetsFileVersion,
    /* JS */
    cdnUrl + '/assets/js/vendor/modernizr-2.6.2-respond-1.1.0.min.js' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/js/vendor/jquery.min.js' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/js/locales/datepicker/datepicker-pt.min.js' + '?v=' + assetsFileVersion, //
    cdnUrl + '/assets/js/locales/datepicker/datepicker-en-GB.min.js' + '?v=' + assetsFileVersion, //
    cdnUrl + '/assets/js/locales/datepicker/datepicker-es.min.js' + '?v=' + assetsFileVersion, //
    cdnUrl + '/assets/js/locales/datepicker/datepicker-de.min.js' + '?v=' + assetsFileVersion, //
    cdnUrl + '/assets/js/core.min.js' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/js/booking-mobile.min.js' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/js/locales/parsley/pt.min.js' + '?v=' + assetsFileVersion, //
    cdnUrl + '/assets/js/locales/parsley/en.min.js' + '?v=' + assetsFileVersion, //
    cdnUrl + '/assets/js/locales/parsley/es.min.js' + '?v=' + assetsFileVersion, //
    cdnUrl + '/assets/js/locales/parsley/de.min.js' + '?v=' + assetsFileVersion, //
    cdnUrl + '/assets/js/release/base.head.min.js' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/js/release/base.vendor.min.js' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/js/release/base.vendor.mobile.min.js' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/js/release/homepage.min.js' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/js/release/homepage.mobile.min.js' + '?v=' + assetsFileVersion,
    cdnUrl + '/assets/js/vendor/webfont.js' + '?v=' + assetsFileVersion,

    /* IMAGES */
    cdnUrl + '/assets/img/logo-bg.png',
    cdnUrl + '/assets/img/sprites/main-sprite-v2.png',
    cdnUrl + '/assets/img/norton-seal-resized.png?scale=downscaleonly&encoder=freeimage&progressive=true&quality=70&w=101&h=53&mode=crop',
    cdnUrl + '/assets/img/brands/header/horizontal-logos/pestana-group.png?scale=downscaleonly&encoder=freeimage&progressive=true&quality=70&w=210&h=59&mode=crop',
    /* OTHERS */
    '/en/home/offline',
];

var STATIC_ASSETS_CACHENAME = 'static-' + STATIC_ASSETS_CHECKSUM;
var EXTERNAL_ASSETS_CACHENAME = 'external-' + EXTERNAL_ASSETS_CHECKSUM;
var IMAGES_CACHENAME = 'images-' + IMAGES_CHECKSUM;

self.addEventListener('install', function (event) {
    //console.log('SW: install event in progress.');
    event.waitUntil(caches.open(STATIC_ASSETS_CACHENAME).then(function (cache) {
        //console.log('SW: store static assets cache');
        return cache.addAll(FILES);
    }));
});

self.addEventListener('activate', function (event) {
    //console.log('SW: activate event in progress.');
    return event.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) {
            if (k !== STATIC_ASSETS_CACHENAME) { //&& k.indexOf('static-') === 0
                //console.log('SW: delete key from cache: ', k);
                return caches.delete(k);
            }
        }));
    }));
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                var returnCache = true;
                for (var i = 0; i < BLACKLIST.length; ++i) {
                    var b = new RegExp(BLACKLIST[i]);
                    if (b.test(event.request.url)) {
                        returnCache = false;
                        break;
                    }
                }

                if (returnCache) {
                    return response;
                }
            }

            return fetch(event.request).then(function (response) {
                var shouldCache = true;

                for (var i = 0; i < BLACKLIST.length; ++i) {
                    var b = new RegExp(BLACKLIST[i]);
                    if (b.test(event.request.url)) {
                        shouldCache = false;
                        break;
                    }
                }

                if (event.request.method === 'POST') {
                    shouldCache = false;
                }

                if (shouldCache) {
                    if ((event.request.url.indexOf('https://assets.pestanatests.com/') !== -1 || event.request.url.indexOf('https://pesweb.azureedge.net/') !== -1)
                        && (event.request.url.indexOf('.png') !== -1 || event.request.url.indexOf('.jpg') !== -1)) {
                        return caches.open(IMAGES_CACHENAME).then(function (cache) {
                            //console.log('SW Fetch: store in images cache: ', event.request.url);
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    }

                    return caches.open(EXTERNAL_ASSETS_CACHENAME).then(function (cache) {
                        //console.log('SW Fetch: store in external assets cache: ', event.request.url);
                        cache.put(event.request, response.clone());
                        return response;
                    });
                } else {
                    //console.log('SW Fetch: not cached: ', event.request.url);
                    return response;
                }
            }).catch(() => caches.match(OFFLINE_URL));
        })
    );
});



if (!Cache.prototype.add) {

    Cache.prototype.add = function add(request) {
        return this.addAll([request]);
    };
}

if (!Cache.prototype.addAll) {

    Cache.prototype.addAll = function addAll(requests) {
        var cache = this;

        function NetworkError(message) {
            this.name = 'NetworkError';
            this.code = 19;
            this.message = message;
        }
        NetworkError.prototype = Object.create(Error.prototype);

        return Promise.resolve().then(function () {
            if (arguments.length < 1) throw new TypeError();

            var sequence = [];

            requests = requests.map(function (request) {
                if (request instanceof Request) {
                    return request;
                }
                else {
                    return String(request);
                }
            });

            return Promise.all(
                requests.map(function (request) {
                    if (typeof request === 'string') {
                        request = new Request(request);
                    }

                    return fetch(request.clone());
                })
            );
        }).then(function (responses) {
            return Promise.all(
                responses.map(function (response, i) {
                    return cache.put(requests[i], response);
                })
            );
        }).then(function () {
            return undefined;
        });
    };
}

if (!CacheStorage.prototype.match) {

    CacheStorage.prototype.match = function match(request, opts) {
        var caches = this;
        return caches.keys().then(function (cacheNames) {
            var match;
            return cacheNames.reduce(function (chain, cacheName) {
                return chain.then(function () {
                    return match || caches.open(cacheName).then(function (cache) {
                        return cache.match(request, opts);
                    }).then(function (response) {
                        match = response;
                        return match;
                    });
                });
            }, Promise.resolve());
        });
    };
}
