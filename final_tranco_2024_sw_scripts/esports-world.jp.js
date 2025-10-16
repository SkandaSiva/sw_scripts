/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  "precache/precache-manifest.e46884c69e2d078bab172d6a15b154eb.js"
);

workbox.core.setCacheNameDetails({prefix: "cacheId"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  "directoryIndex": "/"
});

workbox.routing.registerRoute(/\/recent/, new workbox.strategies.NetworkFirst({ "cacheName":"recent", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/news/, new workbox.strategies.NetworkFirst({ "cacheName":"news", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/game/, new workbox.strategies.NetworkFirst({ "cacheName":"game", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/gaming-device/, new workbox.strategies.NetworkFirst({ "cacheName":"gamingDevice", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/tournament/, new workbox.strategies.NetworkFirst({ "cacheName":"tournament", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/report/, new workbox.strategies.NetworkFirst({ "cacheName":"report", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/column/, new workbox.strategies.NetworkFirst({ "cacheName":"column", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/interview/, new workbox.strategies.NetworkFirst({ "cacheName":"interview", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/movie/, new workbox.strategies.NetworkFirst({ "cacheName":"movie", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/special/, new workbox.strategies.NetworkFirst({ "cacheName":"special", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/search/, new workbox.strategies.NetworkFirst({ "cacheName":"search", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/tag/, new workbox.strategies.NetworkFirst({ "cacheName":"tag", plugins: [new workbox.expiration.Plugin({ maxEntries: 1000, maxAgeSeconds: 86400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/\/writer/, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"writer", plugins: [new workbox.expiration.Plugin({ maxEntries: 100, maxAgeSeconds: 2678400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/.+(?!json)(js|css).*/, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"src", plugins: [new workbox.expiration.Plugin({ maxEntries: 20, maxAgeSeconds: 604800, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/(^(?!.*upload)(?!.*prtimes))(.+(jpeg|jpg|png|gif|svg|mp4).*)/, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"static", plugins: [new workbox.expiration.Plugin({ maxEntries: 100, maxAgeSeconds: 1209600, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/.+(ttf|woff|woff2).*/, new workbox.strategies.CacheFirst({ "cacheName":"fonts", plugins: [new workbox.expiration.Plugin({ maxEntries: 20, maxAgeSeconds: 2678400, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
workbox.routing.registerRoute(/https:\/\/www.googleapis.com\//, new workbox.strategies.CacheFirst({ "cacheName":"googleapis", plugins: [new workbox.expiration.Plugin({ maxEntries: 20, maxAgeSeconds: 259200, purgeOnQuotaError: false }), new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] })] }), 'GET');
