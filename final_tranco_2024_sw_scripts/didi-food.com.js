importScripts('//img0.didiglobal.com/static/soda_static/c/homepage/workbox.4c4f5ca6.js')

workbox.setConfig({
  "debug": false
})

workbox.precaching.precacheAndRoute([], {
  "cacheId": "soda-c-homepage-i18n",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('//img0.didiglobal.com/static/soda_static/c/homepage/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('https://img0.didiglobal.com/static/soda_static/c/homepage/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('https://tracker.didiglobal.com/static/.*'), workbox.strategies.cacheFirst({}), 'GET')
