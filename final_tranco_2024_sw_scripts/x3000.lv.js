self.skipWaiting();

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', () => {});
