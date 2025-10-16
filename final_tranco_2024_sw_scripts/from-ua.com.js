self[`appKey`] = "4170aabedf4691e12b41b9b3022d415c";
self[`hostUrl`] = "https://cdn.gravitec.net/sw";
self.importScripts(`${self[`hostUrl`]}/worker.js`);
// uncomment and set path to your service worker
// if you have one with precaching functionality (has oninstall, onactivate event listeners)
// self.importScripts('path-to-your-sw-with-precaching')
