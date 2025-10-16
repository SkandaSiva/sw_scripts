self[`appKey`] = `f232503759470ebf8810f65b5a898af6`;
self[`hostUrl`] = `https://cdn.gravitec.net/sw`;
self.importScripts(`${self[`hostUrl`]}/worker.js`);
// uncomment and set path to your service worker
// if you have one with precaching functionality (has oninstall, onactivate event listeners)
// self.importScripts('path-to-your-sw-with-precaching')
