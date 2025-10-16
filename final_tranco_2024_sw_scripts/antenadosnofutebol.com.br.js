self[`appKey`] = `627f1d6097ffd8b8b63513e75d2dbb5b`
self[`hostUrl`] = `https://cdn.gravitec.net/sw`
self.importScripts(`${self[`hostUrl`]}/worker.js`)
// uncomment and set path to your service worker
// if you have one with precaching functionality (has oninstall, onactivate event listeners)
// self.importScripts('path-to-your-sw-with-precaching')
