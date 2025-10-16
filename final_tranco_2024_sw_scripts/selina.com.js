/* eslint no-restricted-globals: 1 */

self.addEventListener('install', function(event) {
  self.importScripts('https://js.appboycdn.com/web-sdk/2.5/service-worker.js');
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
