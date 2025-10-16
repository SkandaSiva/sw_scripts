/**
 *  Tous droits réservés NDKDESIGN
 *
 *  @author Hendrik Masson <postmaster@ndk-design.fr>
 *  @copyright Copyright 2013 - 2017 Hendrik Masson
 *  @license   Tous droits réservés
 */

importScripts("https://cdn.onesignal.com/sdks/OneSignalSDK.js");
//importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

var SWVersion = "v002";
var staticCacheName = "ndkPWAstatic";
var dynamicCacheName = "ndkPWAdynamicV2";
var RUNTIME = "runtime";

// var staticCacheName = 'wk-ps-pwa-static-' + SWVersion;
// var filesToCache = [
//     './',
// ];

self.addEventListener("install", function (e) {
  var headers = new Headers();
  headers.append("Service-Worker-Allowed", "/");
  console.log("[ServiceWorker] Install");

  // e.waitUntil Delays the event until the Promise is resolved
  e.waitUntil(
    self.skipWaiting()
    // debut du test Open the cache
    /*caches.open(staticCacheName).then(function(cache) {
             return cache.addAll(filesToCache);
         }).then(function () {
             return self.skipWaiting();
        })*/
  ); // fin du test end e.waitUntil
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== dynamicCacheName) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  ); // end e.waitUntil
  return self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method == "POST") return;
  if (event.request.method == "PUT") return;
  if (!(event.request.url.indexOf("http") === 0)) return;
  if (!(event.request.url.indexOf("taches") === 0)) return;

  var requestUrl = new URL(event.request.url);
  if (requestUrl.pathname == "/OneSignalSDKWorker.js") return;

  event.respondWith(
    caches
      .match(event.request)
      .then(function (resp) {
        return fetch(event.request)
          .then(function (response) {
            return caches.open(dynamicCacheName).then(function (cache) {
              cache.put(event.request, response.clone());
              return response;
            });
          })
          .catch(function (rejectMsg) {
            return (
              resp ||
              function () {
                console.log("Error");
              }
            );
          });
      })
      .catch(function () {
        return caches.match("Error");
      })
  );
});

self.addEventListener("message", function (event) {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

function checkStatus(status) {
  return status == 200 ? true : false;
}
