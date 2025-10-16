// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
self.addEventListener('fetch', function (event) {});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
