'use strict';

self.addEventListener('install', async (e) => {
});

self.addEventListener('activate', async (e) => {
  await clients.claim();
});

self.addEventListener('fetch', async (e) => {
});
