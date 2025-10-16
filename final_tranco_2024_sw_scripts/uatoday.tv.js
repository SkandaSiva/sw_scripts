'use strict';

/**
 * Service Worker of SuperPWA
 * To learn more and add one to your website, visit - https://superpwa.com
 */

const cacheName = 'unian-superpwa-1.0.0';
const startPage = 'https://www.unian.net';
const offlinePage = 'https://www.unian.net';
const filesToCache = [startPage, offlinePage];
const neverCacheUrls = [];

// Install
self.addEventListener('install', function(e) {
    // console.log('SuperPWA service worker installation');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('SuperPWA service worker caching dependencies');
            filesToCache.map(function(url) {
                return cache.add(url).catch(function (reason) {
                    return console.log('SuperPWA: ' + String(reason) + ' ' + url);
                });
            });
        })
    );
});

// Activate
self.addEventListener('activate', function(e) {
    // console.log('SuperPWA service worker activation');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if ( key !== cacheName ) {
                    console.log('SuperPWA old cache removed', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});




self.addEventListener('fetch', function(event) {

    // console.log('The service worker is serving the asset.');
});
// Check if current url is in the neverCacheUrls list
function checkNeverCacheList(url) {
    if ( this.match(url) ) {
        return false;
    }
    return true;
}