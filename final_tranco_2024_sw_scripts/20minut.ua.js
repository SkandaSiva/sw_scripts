
self[`appKey`] = "926cd47363f39357b9246843ed69ffac";
self[`hostUrl`] = "https://cdn.gravitec.net/sw";
self.importScripts(`${self[`hostUrl`]}/worker.js`);
// uncomment and set path to your service worker
// if you have one with precaching functionality (has oninstall, onactivate event listeners)
// self.importScripts('path-to-your-sw-with-precaching')

self.importScripts('https\u003A\/\/vn.20minut.ua\/sw.js')
