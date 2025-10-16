self.addEventListener('install', function () {
  console.log('Install!');
});
self.addEventListener('activate', event => {
console.log("activate")
  event.waitUntil(self.clients.claim());
});
self.addEventListener("beforeinstallprompt", event => {
  console.log('beforeinstallprompt!');
});

self.addEventListener('fetch', function () { });