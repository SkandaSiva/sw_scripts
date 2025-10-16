importScripts('https://app2.salesmanago.pl/static/sm-sw.js');
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', async (event) => {});
