self[`appKey`] = "5d6ce5e4351c8f1fa37878306864123d";
self[`hostUrl`] = "https://cdn.gravitec.net/sw";
self.importScripts(`${self[`hostUrl`]}/worker.js`);
// uncomment and set path to your service worker
// if you have one with precaching functionality (has oninstall, onactivate event listeners)
// self.importScripts('path-to-your-sw-with-precaching')
