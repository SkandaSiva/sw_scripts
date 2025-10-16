// install service worker
self.addEventListener('install', event => {
    // console.log('service worker has been install');
});

// To activate service worker 
self.addEventListener('activate', event => {
    // console.log('service worker has been activated');
});

self.addEventListener('fetch', event => {
    // console.log('service worker has been fetch');
});
