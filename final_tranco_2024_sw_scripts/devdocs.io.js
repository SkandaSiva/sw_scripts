const cacheName = '311c92119a48dbf9c2e7d6ad25c80ffe';

const urlsToCache = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/assets/application-59c255fd04721d1b07524096b1153a41797dd3cdbaa6b57cce7f3cf415f830c7.js',
  '/assets/application-25886a37eae22793077649c7ca0324b665f343164c226c84341a01a0211502ad.css',
  '/assets/sprites/docs-b53c6cf4bd2866bc9b4454d7b988907e95c64a5fa88a80729dc1a3390ba1ef06.png',
  '/assets/sprites/docs@2x-4481145d4d68904673e562eb43f23d3a65b9b079b6ffecfcc766a08e576b9d05.png',
  '/assets/docs-9518f3fdb75c3b26f6485518e737178f6ac49b3246f3d113e0504f0621199c92.js',
  '/docs/css/index.json?1724179506',
  '/docs/dom/index.json?1724179743',
  '/docs/html/index.json?1724178303',
  '/docs/http/index.json?1668720049',
  '/docs/javascript/index.json?1724174503',
];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(urlsToCache)),
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const jobs = keys.map(key => key !== cacheName ? caches.delete(key) : Promise.resolve());
    return Promise.all(jobs);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;

    try {
      const response = await fetch(event.request);
      return response;
    } catch (err) {
      const url = new URL(event.request.url);

      const pathname = url.pathname;
      const filename = pathname.substr(1 + pathname.lastIndexOf('/')).split(/\#|\?/g)[0];
      const extensions = ['.html', '.css', '.js', '.json', '.png', '.ico', '.svg', '.xml'];

      if (url.origin === location.origin && !extensions.some(ext => filename.endsWith(ext))) {
        const cachedIndex = await caches.match('/');
        if (cachedIndex) return cachedIndex;
      }

      throw err;
    }
  })());
});
