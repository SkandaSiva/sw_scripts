self.addEventListener('install', (event) => {
    console.debug('Service Worker installed');
});

self.addEventListener('activate', (event) => {
    console.debug('Service Worker activated');
});

self.addEventListener('fetch', (event) => {
    // for offline functionality
});
