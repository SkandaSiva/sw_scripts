'use strict';

/**
 * Service Worker of statnano-com
 */

const cacheName = 'statnano.com-1.2';
const startPage = 'https://statnano.com';
const offlinePage = 'https://statnano.com/offline/';
const filesToCache = [startPage, offlinePage, 'https://statnano.com/includes/templates/global/seo_menu/menu.css', 'https://statnano.com/includes/templates/global/seo_menu/menu.js', 'https://statnano.com/includes/templates/global/seo_menu/response_menu.css'];
const neverCacheUrls = [/\/report/,/\/product/];

// Install
self.addEventListener('install', function(e) {
    console.log('Statnano service worker installation');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('Statnano service worker caching dependencies');
            filesToCache.map(function(url) {
                return cache.add(url).catch(function (reason) {
                    return console.log('Statnano: ' + String(reason) + ' ' + url);
                });
            });
        })
    );
});

// Activate
self.addEventListener('activate', function(e) {
    console.log('Statnano service worker activation');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if ( key !== cacheName ) {
                    console.log('Statnano old cache removed', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// Fetch
self.addEventListener('fetch', function(e) {

    // Return if the current request url is in the never cache list
    if ( ! neverCacheUrls.every(checkNeverCacheList, e.request.url) ) {
        console.log( 'Statnano: Current request is excluded from cache.' );
        return;
    }

    // Return if request url protocal isn't http or https
    if ( ! e.request.url.match(/^(http|https):\/\//i) )
        return;

    // Return if request url is from an external domain.
    if ( new URL(e.request.url).origin !== location.origin )
        return;

    // For POST requests, do not use the cache. Serve offline page if offline.
    if ( e.request.method !== 'GET' ) {
        e.respondWith(
            fetch(e.request).catch( function() {
                return caches.match(offlinePage);
            })
        );
        return;
    }

    // Revving strategy
    if ( e.request.mode === 'navigate' && navigator.onLine ) {
        e.respondWith(
            fetch(e.request).then(function(response) {
                return caches.open(cacheName).then(function(cache) {
                    cache.put(e.request, response.clone());
                    return response;
                });
            })
        );
        return;
    }

    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request).then(function(response) {
                    return caches.open(cacheName).then(function(cache) {
                        cache.put(e.request, response.clone());
                        return response;
                    });
                });
        }).catch(function() {
            return caches.match(offlinePage);
        })
    );
});

// Check if current url is in the neverCacheUrls list
function checkNeverCacheList(url) {
    if ( this.match(url) ) {
        return false;
    }
    return true;
}