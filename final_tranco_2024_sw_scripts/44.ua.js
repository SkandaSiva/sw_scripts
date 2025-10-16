'use strict';

const CACHE_NAME = 'static-cache-v1';

const FILES_TO_CACHE = [
];

self.addEventListener('install', (event) => {
    // ServiceWorker installed

    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // ServiceWorker activated

    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // fetch event handler

});
