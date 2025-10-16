"use strict";
self.addEventListener("install", function (event) {
  event.waitUntil(preCache(), self.skipWaiting());
});
self.addEventListener("activate", function (event) {
  event.waitUntil(clearOldCaches(), self.clients.claim());
});
self.addEventListener("fetch", function (event) {
  return false;
});
function preCache() {}
function clearOldCaches() {}
