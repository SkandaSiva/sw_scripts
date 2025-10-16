'use strict';

var cacheName = "szybko_pl-pwa-v" + new Date().getTime();
var offlinePage = "/offline";
const neverCacheUrls = [
    '/connect/keycloak', '/connect/keycloak/', '/connect/keycloak/*',
    '/connect/keycloak/check', '/connect/keycloak/logout', 
    '/connect/keycloak/password-reset', 
    '/connect/keycloak/usun-konto',
    '/verify-token',
    '/moje', '/moje/*', '/moje/', '/moje/dane-profilowe/',
    '/moje/zapisane-wyszukiwania/', '/moje/oznaczone-nieruchomosci/',
    '/slowo-kluczowe', '/slowo-kluczowe/',
    '/mapa', '/mapa/', '/mapa/na-sprzedaz/', '/mapa/na-wynajem/'
];
var filesToCache = [
    'https://szybko.pl/?source=pwa',
    'https://szybko.pl?utm_source=homescreen',
    
    'https://szybko.pl/offline',
    'https://szybko.pl/cookie',
    'https://szybko.pl/polityka-prywatnosci',
    'https://szybko.pl/regulamin',
    
    'https://cdn.szybko.pl/images/logo-szybko.svg',
    'https://cdn.szybko.pl/images/premium.webp',
    
    'https://cdn.szybko.pl/images/posrednicy-top-5.webp',
    'https://cdn.szybko.pl/images/asset-list-slider.webp',
    
    'https://cdn.szybko.pl/images/offline_list.webp',
    'https://cdn.szybko.pl/images/offline.webp',
    'https://cdn.szybko.pl/images/no_photo.webp',
    'https://cdn.szybko.pl/images/no_photo_detail.webp',
    
    'https://cdn.szybko.pl/images/socials/facebook.webp',
    'https://cdn.szybko.pl/images/socials/messenger.webp',
    'https://cdn.szybko.pl/images/socials/twitter.webp',
    'https://cdn.szybko.pl/images/socials/telefon.webp',
    'https://cdn.szybko.pl/images/socials/chat.webp',
    'https://cdn.szybko.pl/images/socials/mail.webp',
    
    'https://cdn.szybko.pl/images/socials/prfn_logo.webp',
    'https://cdn.szybko.pl/images/socials/prfn_logo.png',
    
    'https://cdn.szybko.pl/images/zobacz-mape.webp',
    'https://cdn.szybko.pl/images/zobacz-street-view.webp',
    'https://cdn.szybko.pl/images/zobacz-mape.png',
    'https://cdn.szybko.pl/images/zobacz-street-view.png'
];

// Install
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            filesToCache.map(function (url) {
                return cache.add(url).catch(function (reason) {
                    return console.log('PWA: ' + String(reason) + ' ' + url);
                });
            });
        })
    );
});

// Activate
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// Fetch
self.addEventListener('fetch', function (e) {
    
    // Return if the current request url is in the never cache list
    if (!neverCacheUrls.every(checkNeverCacheList, e.request.url)) {
        return;
    }

    // Return if request url protocal isn't http or https
    if (!e.request.url.match(/^(http|https):\/\//i)) {
        return;
    }
    
    // Return if request url is from an external domain.
    if (new URL(e.request.url).origin !== location.origin) {
        return;
    }
    
    // For POST requests, do not use the cache. Serve offline page if offline.
    if (e.request.method !== 'GET') {
        e.respondWith(
            fetch(e.request).catch(function () {
                return caches.match(offlinePage);
            })
        );
        return;
    }

    // Revving strategy
    if (e.request.mode === 'navigate' && navigator.onLine) {
        e.respondWith(
            fetch(e.request).then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    cache.put(e.request, response.clone());
                    return response;
                });
            })
        );
        return;
    }

    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request).then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        }).catch(function () {
            return caches.match(offlinePage);
        })
    );
});

// Check if current url is in the neverCacheUrls list
function checkNeverCacheList(url) {
    if (this.match(url)) {
        return false;
    }
    return true;
}
