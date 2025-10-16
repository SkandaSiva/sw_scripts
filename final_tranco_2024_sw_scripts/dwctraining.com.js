// sw.js
// author: Wasay Syed
'use strict';

//let userAgentData = navigator.userAgentData;

self.importScripts('/swhelper.js');

// swdebug = true;

//SWHelper.debugObject('', 'start /sw.js');

// https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts
self.addEventListener('install', function (event) {
    //SWHelper.debugObject('', 'sw-install()');

     // The promise that skipWaiting() returns can be safely ignored.
     self.skipWaiting();

     event.waitUntil(
          caches.open(SWHelper.staticCacheName).then(function (cache) {
               //SWHelper.debugObject('', 'sw-addEventListener()-install-1-staticCacheName.cache');
               return cache.addAll([
                   // bundle
                   '/design2021/theme-dwc/jquery-ui-1.13.2.custom/jquery-ui.min.css',
                   '/design2021/theme-dwc/jquery-ui-1.13.2.custom/jquery-ui.min.js',
                    // css
                    '/css/fonts/fontawesome.css?v=20221222-1155',
                    '/design2021/css/fontawesome.min.css',
                    '/css/bootstrap/bootstrap.min.css'+(swCachePostfix),
                    // javascript
                    '/design2021/js/jquery-2.0.3/jquery-2.0.3.min.js',
                    '/javascript/bootstrap/bootstrap.min.js'+(swCachePostfix),
                    // images in next statement
                    // fonts
                    '/design2021/fonts/Averia/AveriaSerifLibre-Regular.ttf',
                    '/design2021/fonts/fontawesome-webfont.woff2',
                    // json
                    // other files
               ]);
          }).then((result) => {
            //SWHelper.debugObject(result, 'sw-addEventListener()-install-2-result');
            caches.open(SWHelper.contentAssetsCache).then(function (cache) {
                //SWHelper.debugObject('', 'sw-addEventListener()-install-2-contentAssetsCache.cache');
                return cache.addAll([
                    // css
                    '/design2021/css/style.css'+(swCachePostfix),
                    '/design2021/css/home-style.css'+(swCachePostfix),
                    '/design2021/css/portal-style.css'+(swCachePostfix),
                    '/css/Vce/Tap/validation_frontend.css'+(swCachePostfix),
                    // javascript
                    '/javascript/dialog.js'+(swCachePostfix),
                    '/swhelper.js',
                    '/sw.js',
                    '/design2021/js/custom.js'+(swCachePostfix),
                    '/javascript/site.js'+(swCachePostfix),
                    '/client/scripts/selectoptions.js'+(swCachePostfix),
                    '/javascript/dateTime.js'+(swCachePostfix),
                    '/javascript/form_validation.js'+(swCachePostfix),
                    // images in next statement
                    // fonts
                    // json
                    '/manifest.json',
                    // other files
                    //'/site.webmanifest',
                    //'/404.htm',
                    //'/500.htm',
                    //'/Home.id.2.htm',
                    //'/robots.php',
                    '/offline.htm',
                ]);
            }).then((result) => {
                //SWHelper.debugObject(result, 'sw-addEventListener()-install-3-result');
                return true;
            });
        }).then((result) => {
            //SWHelper.debugObject(result, 'sw-addEventListener()-install-2-result');
            caches.open(SWHelper.contentImgsCache).then(function (cache) {
                //SWHelper.debugObject('', 'sw-addEventListener()-install-2-contentImgsCache.cache');
                return cache.addAll([
                    '/images/fav-icons/favicon.ico',
                    '/images/fav-icons/icon-144x144.png',
                    '/images/fav-icons/icon-180x180.png',
                    '/images/fav-icons/icon-192x192.png',
                    '/images/fav-icons/icon-512x512.png',
                    '/images/fav-icons/favicon-16x16.png',
                    '/images/fav-icons/favicon-32x32.png',
                    '/design2021/images/DWC-logo-icon.png',
                    '/design2021/images/mobile-menu-icon.png',
                    '/design2021/images/home-banner.jpg',
                    '/design2021/images/mob-home-banner.jpg',
                    '/design2021/images/feather-arrow-left-circle.png',
                    '/design2021/images/feather-arrow-right-circle.png',
                    '/design2021/images/feather-calendar.png',
                    '/design2021/images/material-computer.png',
                    '/design2021/images/dwc-footer-logo.png',
                    '/design2021/images/training-bg.jpg',
                    '/design2021/images/carousel-prev.png',
                    '/design2021/images/new-carousel-prev.png',
                ]);
            }).then((result) => {
                //SWHelper.debugObject(result, 'sw-addEventListener()-install-3-result');
                return true;
            });
        })
               .catch(error => {
                    // Oops!. Got an error from server.
                    error.message = (`Request failed. Returned status of ${error.message} - sw-install()`);
                    throw error;
               })
     );
});

self.addEventListener('activate', function (event) {
    //SWHelper.debugObject('', 'sw-activate()');
     event.waitUntil(
          cleanCache()
               .catch(error => {
                    // Oops!. Got an error from server.
                    error.message = (`Request failed. Returned status of ${error.message} - sw-activate()`);
                    return false;
               })
     );
});

self.addEventListener('fetch', function (event) {
    //SWHelper.debugObject('', 'sw-addEventListener()-fetch()');

    // Let the browser do its default thing
    // for non-GET requests.
    if (event.request.method !== "GET") return;

    const requestUrl = new URL(event.request.url);

    // same host request
    if (requestUrl.origin === location.origin)
    {
        // homepage only
        if (requestUrl.pathname === '' || requestUrl.pathname === '/')
        {
            const cacheResponse = caches.match('/Home.id.2.htm');
            //SWHelper.debugObject((!!cacheResponse.then(response => response)), 'sw-addEventListener()-cacheResponse');
        }
    }

    // Prevent the default, and handle the request ourselves.
    event.respondWith(
        (async () => {

            try {
                // Try to get the response from a cache.
                const staticCache = await caches.open(SWHelper.staticCacheName);
                const staticCachedResponse = await staticCache.match(event.request);
                if (staticCachedResponse) {
                    // If we found a match in the cache, return it, but also
                    // update the entry in the cache in the background.
                    event.waitUntil(staticCache.add(event.request));
                    return staticCachedResponse;
                }

                const contentAssetsCache = await caches.open(SWHelper.contentAssetsCache);
                const contentAssetsCachedResponse = await contentAssetsCache.match(event.request);
                if (contentAssetsCachedResponse) {
                    // If we found a match in the cache, return it, but also
                    // update the entry in the cache in the background.
                    event.waitUntil(contentAssetsCache.add(event.request));
                    return contentAssetsCachedResponse;
                }

                const contentImgsCache = await caches.open(SWHelper.contentImgsCache);
                const contentImgsCachedResponse = await contentImgsCache.match(event.request);
                if (contentImgsCachedResponse) {
                    // If we found a match in the cache, return it, but also
                    // update the entry in the cache in the background.
                    event.waitUntil(contentImgsCache.add(event.request));
                    return contentImgsCachedResponse;
                }

                // If we didn't find a match in the cache, use the network.
                return await fetch(event.request);
            }
            catch (error)
            {
                // catch is only triggered if an exception is thrown, which is likely
                // due to a network error.
                // If fetch() returns a valid HTTP response with a response code in
                // the 4xx or 5xx range, the catch() will NOT be called.
                console.log('Fetch failed; returning offline page instead.', error);

                //const contentAssetsCache = await caches.open(SWHelper.contentAssetsCache);
                //return await contentAssetsCache.match('/offline.htm');
            }
        })(),
    );
});

//https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
     if (!url) return false;
     name = name.replace(/[\[\]]/g, '\\$&');
     const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
     if (!results) return null;
     if (!results[2]) return '';
     return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function cleanCache() {
     return caches.keys().then(function (cacheNames) {
          return Promise.all(
               cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith(SWHelper.swAppPrefix) &&
                         !allCaches.includes(cacheName);
               }).map(function (cacheName) {
                    return caches.delete(cacheName);
               })
          );
     })
          .catch(error => {
               // Oops!. Got an error from server.
               error.message = (`Request failed clean cache. Returned status of ${error.message} -sw-cleanCache()`);
               throw error;
          });
}

function clearCacheFiles(files) {
     return caches.keys().then(function (cacheNames) {
          return Promise.all(
               cacheNames.filter(function (cacheName) {
                    //return caches.delete(cacheName);
				// console.log("self.addEventListene Fetch request");
				// if (window.location.href.includes('Home.id.2.htm')) {
				// 	console.log("Fetch request for:", window.location.href);
				// 	caches.open("cache-v2").then(function(cache) {
				// 		console.log("Match cache request :", window.location.href);
				// 		caches.match(window.location.href).then(function(response) {
				// 			// your cache is now deleted
				// 			console.log("Cache is being deleted for:", window.location.href);
				// 			cache.delete(window.location.href);
				// 			console.log("Cache deleted for:", window.location.href);
				// 		});
				// 	});
				// }
               })
          );
     })
          .catch(error => {
               // Oops!. Got an error from server.
               error.message = (`Request failed clear file from cache. Returned status of ${error.message} -sw-cleanFiles()`);
               throw error;
          });
}