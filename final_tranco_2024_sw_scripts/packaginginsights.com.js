// src/service-worker.js
// Install event
self.addEventListener('install', (event) => {
    //console.log('Service Worker installing...');
});
// Activate event
self.addEventListener('activate', (event) => {
//console.log('Service Worker activating...');
});
// Fetch event
self.addEventListener('fetch', (event) => {
//console.log('Fetch event for ', event.request.url);
});