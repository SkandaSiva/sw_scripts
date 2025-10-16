'use strict';

var cacheName = 'novel-reader';
var urlsToCache = [''];

self.addEventListener('fetch', function (event) {

});

self.addEventListener('install', function (ev) {
    // ev.waitUntil(caches.open(cacheName).then(function (cache) {
    //     cache.addAll(urlsToCache.map(function (el) { return el; }));
    // }));
});

self.addEventListener('activate', function (ev) {
    ev.waitUntil(caches.keys().then(function (keyList) {
        keyList.forEach(function (key) {
            if (key !== cacheName) 
            caches.delete(key);
        });
    }));
    return self.clients.claim();
});
