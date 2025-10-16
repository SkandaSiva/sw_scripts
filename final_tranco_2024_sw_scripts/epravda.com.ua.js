self[`appKey`] = `ac81c471b10a28d123ebe01d3e84f381`;
self[`hostUrl`] = `https://cdn.gravitec.net/sw`;
self.importScripts(`${self[`hostUrl`]}/worker.js`);
// uncomment and set path to your service worker
// if you have one with precaching functionality (has oninstall, onactivate event listeners)
// self.importScripts('path-to-your-sw-with-precaching')