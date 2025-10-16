self.addEventListener('install', function onInstall(event) {
    self.skipWaiting()
});

self.addEventListener('activate', function onActivate(event) {
    self.clients.claim();
});

self.addEventListener('fetch', function onFetch(event) {
    return true;
});