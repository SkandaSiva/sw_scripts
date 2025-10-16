"use strict";
var CACHE_NAME = "static-cache-v2";
var FILES_TO_CACHE = [
  "https://www.kubofinanciero.com/offline-calipso.html",
  "https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2",
  "https://www.kubofinanciero.com/assets/icons/brand/logo-kubo.jpg",
];
self.addEventListener("install", function (evt) {
  /* Precache static resources here. */ evt.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});
self.addEventListener("activate", function (evt) {
  /* Remove previous cached data from disk. */ evt.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});
self.addEventListener("fetch", function (evt) {
  /* Add fetch event handler here. */ if (evt.request.mode !== "navigate") {
    /* Not a page navigation, bail. */ return;
  }
  evt.respondWith(
    fetch(evt.request).catch(function () {
      return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match("offline-calipso.html");
      });
    })
  );
});
/* SERVICE WORKER INFOBIP WEB PUSH NOTIFICATIONS */
// const params = new URLSearchParams(self.location.search);importScripts('https://webpush.infobip.com/infobip-service-worker-latest.js?version=' + params.get("version") + "&appCode=" + params.get("appCode"))
