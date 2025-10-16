self[`appKey`] = `9b29f19ade3a06fcf089a0f73157a8a1`;
self[`hostUrl`] = `https://cdn.gravitec.net/sw`;
self.importScripts(`${self[`hostUrl`]}/worker.js`);
// uncomment and set path to your service worker
// // if you have one with precaching functionality (has oninstall, onactivate event listeners)
// // self.importScripts('path-to-your-sw-with-precaching')
//
