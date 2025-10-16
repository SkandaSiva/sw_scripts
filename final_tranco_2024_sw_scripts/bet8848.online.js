/*
 * @Author: w_gd
 * @Date: 2024-03-30 10:59:14
 * @LastEditors: stingyxin 894739825@qq.com
 * @LastEditTime: 2024-05-10 09:54:20
 * @FilePath: /ChromeApp/service-worker.js
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
// Use the install event to pre-cache all initial resources.
// cacheList chage  cacheStorageKey chage
var cacheStorageKey = 'test-pwa-0'
var cacheList = [
  '/',
  "index.html",
  "main.js",
]

self.addEventListener("install", function (event) {
    // add cacheList
    // event.waitUntil(
    //     caches.open(cacheStorageKey).then(function (cache) {
    //         return cache.addAll([
    //             "./index.html",
    //             "./cocos2d-js-min.js",
    //             "./main.js",
    //             "./style-mobile.css",
    //         ]);
    //     })
    // );
});
self.addEventListener("fetch", function (event) {
    // check cacheList
    // event.respondWith(
    //     caches.match(event.request).then(function (response) {
    //         return response || fetch(event.request);
    //     })
    // );
});

self.addEventListener("activate", function (event) {
    // clear cacheList
    // event.waitUntil(
    //     caches.keys().then(function (keyList) {
    //         return Promise.all(keyList.map(function (key) {
    //             if (key !== cacheStorageKey) {
    //                 return caches.delete(key);
    //             }
    //         }));
    //     })
    // );
});

self.addEventListener('beforeinstallprompt', function (e) {
    // isInstallAvailable
    e.preventDefault();
    window.deferredPrompt = e;
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
        './service-worker.js'
        // , { 
        //     scope: '/OSS/ChromeApp/',
        // }
    );
}