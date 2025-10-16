self[`appKey`] = `ad0963feaf063918c600160aafdc7d6c`;
self[`hostUrl`] = `https://cdn.gravitec.net/sw`;
self.importScripts(`${self[`hostUrl`]}/worker.js`);
// uncomment and set path to your service worker
// if you have one with precaching functionality (has oninstall, onactivate event listeners)
// self.importScripts('path-to-your-sw-with-precaching')
//DESCOMENTAR LO DE ABAJO PARA HACERLO FUNCIONAR EN TEST:
// self[`appKey`] = `f6660012579321e09572d26145c09277`;
// self[`hostUrl`] = `https://cdn.gravitec.net/sw`;
// self.importScripts(`${self[`hostUrl`]}/worker.js`);