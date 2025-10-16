self.addEventListener('fetch', function(event) {});
if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/service-worker.js') }
