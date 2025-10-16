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

importScripts("https://teja9.kuikr.com/public/pwa/qpreact/workbox-v3.6.3/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "https://teja9.kuikr.com/public/pwa/qpreact/workbox-v3.6.3"});

importScripts(
  "https://www.quikr.com/quikrSw.js",
  "https://teja9.kuikr.com/public/pwa/qpreact/precache-manifest.60144109bbe17651b1eb050c29e4f6f4.js"
);

workbox.core.setCacheNameDetails({prefix: "quikrSW"});

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  "ignoreUrlParametersMatching": [/^utm_/, /dummy_to_update_sw8/]
});

workbox.routing.registerRoute(/^https:\/\/www.quikr.com\/dist\//, workbox.strategies.cacheFirst({ "cacheName":"assets", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":15,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/public\/jobspwa\/msite-dfp.*/, workbox.strategies.cacheFirst({ "cacheName":"js", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":1,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/public\/mon\/qap/, workbox.strategies.cacheFirst({ "cacheName":"js", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":1,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/js\/bakerst-min.*/, workbox.strategies.cacheFirst({ "cacheName":"js", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":1,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/public\/jobspwa\/js/, workbox.strategies.cacheFirst({ "cacheName":"js", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":15,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/public\/jobspwa\/css/, workbox.strategies.cacheFirst({ "cacheName":"css", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":15,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute("https:\\/\\/www.quikr.com\\/jobs\\/api\\/qc\\/jobs\\/v1\\/sme\\/view\\/listing", workbox.strategies.cacheFirst({ "cacheName":"apis", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":15,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/www.quikr.com\/dist\//, workbox.strategies.cacheFirst({ "cacheName":"assets", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":518400,"maxEntries":5,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/https:\/\/teja9.kuikr.com\/public\/pwa\/qpreact/, workbox.strategies.cacheFirst({ "cacheName":"pwaAssets", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":35,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/kuikr.com\/public\/core\/escrow\//, workbox.strategies.cacheFirst({ "cacheName":"assets", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":25,"purgeOnQuotaError":true})] }), 'GET');
workbox.routing.registerRoute(/kuikr.com\/public\/core\/dist\/escrow\/js/, workbox.strategies.cacheFirst({ "cacheName":"js", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":25,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/kuikr.com\/public\/core\/dist\/escrow\/css/, workbox.strategies.cacheFirst({ "cacheName":"css", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":25,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/restatic\/static\/js/, workbox.strategies.cacheFirst({ "cacheName":"webpackJs", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":25,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/restatic\/build\/js/, workbox.strategies.cacheFirst({ "cacheName":"gulpjs", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":15,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/restatic\/static\/3.3.4\/realestate/, workbox.strategies.cacheFirst({ "cacheName":"monJS", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":15,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/module_assets\/images\/quikr_homes_logo.png/, workbox.strategies.cacheFirst({ "cacheName":"headerLogo", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":1,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/restatic\/static\/assets\/css/, workbox.strategies.cacheFirst({ "cacheName":"css", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":15,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/restatic\/static\/assets\/sass\/web\/fonts/, workbox.strategies.cacheFirst({ "cacheName":"font", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":25,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/teja8.kuikr.com\/restatic\/static\/assets\/sass\/web\/font-icon/, workbox.strategies.cacheFirst({ "cacheName":"fontIcon", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"maxEntries":5,"purgeOnQuotaError":true}), new workbox.cacheableResponse.Plugin({"statuses":[200]})] }), 'GET');
