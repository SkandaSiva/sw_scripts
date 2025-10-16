//
self.addEventListener('install', function (event) {
    console.log('ServiceWorker install');
});

//
self.addEventListener('fetch', function (event) {
    console.log('ServiceWorker fetch');
});

//
self.addEventListener('activate', event => {
    console.log('activate ServiceWorker');
});