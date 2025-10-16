
var cacheName = 


'JustTires-v1731396655129';
var coreCacheName = cacheName + '-' +'core';
var assetsCacheName = cacheName + '-' + 'assets';
var pagesCacheName = cacheName + '-' + 'pages';
var maxCacheAge = 15;
var pagesToExclude =
[
    "https://www.justtires.com/en_US/login",
    "https://www.justtires.com/en_US/account-show",
    "https://www.justtires.com/en_US/cart",
    "https://www.justtires.com/en_US/confirm",
    "https://www.justtires.com/en_US/checkout"
]
;
var coreCacheUrls =
[
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/css/global.css",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/css/rollFleet.css",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/css/experience/storePage.css",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/css/homePage.css",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/css/search.css",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/css/storeLocator.css",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/css/contactUs.css",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/css/writeReview.css",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/js/main.js",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/js/rollFleet.js",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/js/carousel/carousel.js",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/js/search.js",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/js/productDetail.js",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/js/storeDetails.js",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/js/storeLocator.js",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/js/contactUs.js",
    "/on/demandware.static/Sites-JustTires-Site/-/en_US/v1731396655129/js/tireRegistration.js"
]
;

// Precaches core assets and load only coreCacheUrls in offline mode
function updateCoreCache() {
return caches.open(coreCacheName)
.then(cache => {
// Make installation contingent on storing core cache items
return cache.addAll(coreCacheUrls);
});
}
// Check if request is something SW should handle
function shouldCache(event) {
var request = event.request,
url = new URL(request.url);
return (request.method === 'GET');
}
// Adds the response to cache
function addToCache(cacheName, request, response) {
caches.open(cacheName)
.then( cache => cache.put(request, response) );
}
// Remove old caches that done't match the current version
function clearCaches() {
return caches.keys().then(cacheKeys => {
return Promise.all(
cacheKeys.map(cacheName => {
if (cacheName !== coreCacheName && cacheName !== assetsCacheName) {
return caches.delete(cacheName);
}
})
);
});
}
// Install Event
self.addEventListener('install', event => {
self.skipWaiting();
event.waitUntil(updateCoreCache());
});
// Activate Event
self.addEventListener('activate', event => {
event.waitUntil(
clearCaches().then( () => {
return self.clients.claim();
})
);
});
// Fetch event interceptor
self.addEventListener('fetch', event => {
var request = event.request;
var acceptHeader = request.headers.get('Accept');
var requestUrl = new URL(request.url);
var isOnline = self.navigator.onLine;
if (event.request.method !== "GET" || pagesToExclude.includes(requestUrl.href)) {
return;
}

// Assets cache
if (acceptHeader.indexOf('text/html') === -1 && (request.destination && request.destination !== 'empty')) {
event.respondWith(
caches.match(request)
.then(response => {
return response || fetch(request)
.then(response => {
if (response.ok) {
if (shouldCache(event)) {
addToCache(assetsCacheName, request, response.clone());
}
}
return response;
})
.catch(error => {
console.error(error);
});
})
);
}
});
