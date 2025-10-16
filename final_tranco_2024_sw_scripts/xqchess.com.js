self.importScripts('workbox-sw.js');
workbox.precaching.precacheAndRoute([
    {
        "url": "pwa.html",
        "revision": "1"
    }
]);

/*self.addEventListener('fetch', function (event) {
});*/