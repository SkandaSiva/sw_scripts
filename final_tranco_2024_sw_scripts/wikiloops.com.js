/**
 * The serviceworker implementation, caches some bootup relevant assets and delivers offline Page if need be
 * File must live in root folder, obviously doesn't work if it's residing in a subfolder
 */

const CACHE_VERSION = 'bv-8029637149-1';// do not touch, is set during build by BuildSteps.php
const CURRENT_CACHES = {
    stuff: 'wl-cache-v' + CACHE_VERSION + '',
    offline: 'offline-v' + CACHE_VERSION,
    scripts: 'js-v' + CACHE_VERSION
};
const OFFLINE_URL = '/serviceWorkerOfflinePage.html';

// define some assets which should be pre-fetched on initialisation
const urlsToCacheStuff = [
    'https://wloops2.r.worldssl.net/awsCloud/img/10-11-min.png'
];
const urlsToCacheJS = [

];
const urlsToCacheOFFLINE = [
    '/serviceWorkerOfflinePage.html',
 //   createCacheBustedRequest('/a_js/js_bootup_v01.js'),
    createCacheBustedRequest('serviceworker_js.js')
];

function createCacheBustedRequest(url) {
    const request = new Request(url, {cache: 'reload'});
    // See https://fetch.spec.whatwg.org/#concept-request-mode
    // This is not yet supported in Chrome as of M48, so we need to explicitly check to see
    // if the cache: 'reload' option had any effect.
    if ('cache' in request) {
        return request;
    }

    // If {cache: 'reload'} didn't have any effect, append a cache-busting URL parameter instead.
    const bustedUrl = new URL(url, self.location.href);
    bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
    return new Request(bustedUrl);
}

self.addEventListener('install', function (event) {
    // Perform install steps
    // console.log('sw install');
    event.waitUntil(
        fetch(createCacheBustedRequest(OFFLINE_URL)).then(function (response) {
            return caches.open(CURRENT_CACHES.offline).then(function (cache) {
                return cache.addAll(urlsToCacheOFFLINE);
            });
        })
            .then(function () {
                caches.open(CURRENT_CACHES.stuff).then(function (cache) {
                    return cache.addAll(urlsToCacheStuff);
                });
                caches.open(CURRENT_CACHES.scripts).then(function (cache) {
                    return cache.addAll(urlsToCacheJS);
                });
                self.skipWaiting().then(() => {});
            }).catch(error => {
            console.log(error);
        })
    );
});

self.addEventListener('fetch', function (event) {

    // prevent interception of:
    // post requests, ajax/, /ava, anything that is not .php, .css, .js and .png
    if (
        event.request.method !== 'GET' ||
        event.request.url !== event.request.url.replace('ajax/', '') ||
        event.request.url !== event.request.url.replace('/ava', '') ||
        event.request.url !== event.request.url.replace('test.wikiloops', '') ||
        event.request.url !== event.request.url.replace('testrich.wikiloops', '') ||
        (
            event.request.url === event.request.url.replace('.php', '') &&
            event.request.url === event.request.url.replace('.css', '') &&
            event.request.url === event.request.url.replace('.js', '') &&
            event.request.url === event.request.url.replace('.png', '')
        )

    ) {
        // console.log('ignore fetch in sw: '+event.request.url);
    }
    // intercept any clicks that call .php files and deliver offline Page if no proper response comes in
    else if (event.request.mode === 'navigate' &&
        event.request.headers.get('accept').includes('text/html') &&
        event.request.url !== event.request.url.replace('.php', '')
    ) {
        // console.log('checking offline before delivery sw: '+event.request.url);
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
    }
    // intercept anything not ending on .php
    else if (event.request.url === event.request.url.replace('.php', '')) {

        // add css and js files to cache if they are delivered from a loops domain (covers CDN, too)
        if (
            (event.request.url !== event.request.url.replace('.js', '') ||
                event.request.url !== event.request.url.replace('.css', '')
            ) &&
            event.request.url !== event.request.url.replace('loops', '')
        ) {
            // console.log('checking scripts cache before delivery sw: '+event.request.url);
            // serve from cache, if not present, fetch & add javascript files to cache if their origin contains 'loop' - blocks adsense etc. from getting stuck in SW
            event.respondWith(
                caches.match(event.request).then(function (response) {
                    return response || fetch(event.request).then(function (response) {
                        if (response.status == 200) {
                            const responseClone = response.clone();
                            caches.open(CURRENT_CACHES.scripts).then(function (cache) {
                                cache.put(event.request, responseClone).then(() => {
                                });
                            });
                        }
                        return response;
                    });
                })
            );
        }
        // add other assets to "stuff" cache, it is questionable if that makes a lot of sense, as we cannot expect
        // our serviceworker cache will keep all avaters, waveform images etc etc around for long - let's leave that
        // to the regular cache, and add only stuff here which is either relevant to speed up page loading/rendering
        // OR to display the offline page. We'll use explicit matches for now
        // mind, the only way to refresh these files is to change the current caches number...
        else if (event.request.url !== event.request.url.replace('12thBday', '')
        ) {
            // console.log('checking stuff cache before delivery sw: '+event.request.url);
            event.respondWith(
                caches.match(event.request).then(function (response) {
                    return response || fetch(event.request).then(function (response) {
                        if (response.status == 200) {
                            const responseClone = response.clone();
                            caches.open(CURRENT_CACHES.stuff).then(function (cache) {
                                cache.put(event.request, responseClone).then(() => {});
                            });
                        }
                        return response;
                    });
                })
            );
        }
    }
});

self.addEventListener('activate', function (event) {
    // console.log('sw activation');
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                    if (cacheName !== 'offline-v' + CACHE_VERSION && cacheName !== 'wl-cache-v' + CACHE_VERSION && cacheName !== 'js-v' + CACHE_VERSION && cacheName !== 'music-v') {
                        // console.log('dumping cache, ' + cacheName);
                        return true;
                    }
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});