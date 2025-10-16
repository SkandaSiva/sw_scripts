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

importScripts("https://teja8.kuikr.com/cfassets/js/workbox-v3.6.3/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "https://teja8.kuikr.com/cfassets/js/workbox-v3.6.3"});

importScripts(
  "https://www.commonfloor.com/commonfloorSw.js",
  "https://teja8.kuikr.com/cfassets/js/precache-manifest.60144109bbe17651b1eb050c29e4f6f4.js"
);

workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/\.css/, workbox.strategies.staleWhileRevalidate({ "cacheName":"cf-css-cache", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"purgeOnQuotaError":true})] }), 'GET');
workbox.routing.registerRoute(/\.js$/, workbox.strategies.staleWhileRevalidate({ "cacheName":"cf-js-cache", plugins: [new workbox.expiration.Plugin({"maxAgeSeconds":3600,"purgeOnQuotaError":true})] }), 'GET');
