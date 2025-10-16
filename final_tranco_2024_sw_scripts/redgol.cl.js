self[`appKey`] = `9a92ee3cb56abb61816215a82d321de2`
self[`hostUrl`] = `https://cdn.gravitec.net/sw`
self.importScripts(`${self[`hostUrl`]}/worker.js`)
// uncomment and set path to your service worker
// if you have one with precaching functionality (has oninstall, onactivate event listeners)
// self.importScripts('path-to-your-sw-with-precaching')
