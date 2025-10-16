self[`appKey`] = "1fb8989157c2eb52c673b90d747be33e";
self[`hostUrl`] = "https://cdn.gravitec.net/sw";
self.importScripts(`${self[`hostUrl`]}/worker.js`);
// uncomment and set path to your service worker
// if you have one with precaching functionality (has oninstall, onactivate event listeners)
// self.importScripts('path-to-your-sw-with-precaching')
