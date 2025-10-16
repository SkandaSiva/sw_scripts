self[`appKey`] = `5c6b42e98583074448c6be1006b7691b`
self[`hostUrl`] = `https://cdn.gravitec.net/sw`
self.importScripts(`${self[`hostUrl`]}/worker.js`)
// uncomment and set path to your service worker
// if you have one with precaching functionality (has oninstall, onactivate event listeners)
// self.importScripts('path-to-your-sw-with-precaching')
