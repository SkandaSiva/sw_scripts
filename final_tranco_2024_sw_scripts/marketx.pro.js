// версия хранилища cacheStorage. При любых изменениях необходимо менять версию
const staticCacheName = `static-cache-v113`;
// статический список кэшируемых файлов, для работы offline page
const staticAssets = [
  '/favicon.ico', // /offline/favicon.ico
  '/images/mx/darkMx.png', // /images/mx/darkMx.png
  '/offline/offline.html',
  '/favicon-32x32.png', // /offline/favicon-32x32.png
  '/offline/offline.css',
  '/android-chrome-512x512.png', // '/offline/marketx_logo.png',
  '/android-chrome-192x192.png', // '/offline/marketx_logo.png',
  // '/offline/android-icon-192x192-seochecker-manifest-1415.png',
];

// инициализация хранилища
self.addEventListener('install', async () => {
  // console.log('installed SW');
  const cache = await caches.open(staticCacheName);
  await cache.addAll(staticAssets);
  self.skipWaiting();
});

/**активация хранилища, с проверкой, для удаления неиспользуемых версий кэша*/
self.addEventListener('activate', async () => {
  // console.log('activate SW');
  const cachesKeys = await caches.keys();
  const checkKeys = cachesKeys.map(async key => {
    if (staticCacheName !== key) {
      await caches.delete(key);
    }
  });
  await Promise.all(checkKeys);
});

/**перехват запросов, при ошибке запроса - возвращается offline.html из кэша*/
self.addEventListener('fetch', event => {
  const willResponseOffline = fetchMatch(event.request, staticAssets);
  switch (willResponseOffline) {
    case 'offlineIndex':
      event.respondWith(
        caches
          .match(event.request)
          .then(cachedResponse => {
            return cachedResponse || fetch(event.request);
          })
          .catch(error => {
            console.log('offlineIndex ERROR', error);
            return caches.match('/offline/offline.html');
          })
      );
      break;
    case 'offlineStatic':
      event.respondWith(
        caches
          .match(event.request)
          .then(cachedResponse => {
            return cachedResponse || fetch(event.request);
          })
          .catch(error => {
            console.log('there is no request file in Static Cache', error);
          })
      );
      break;
  }
});

/**
 * * Проверяет, должен ли service worker подставлять offline страницу-заглушку
 *  * по запрошенному адресу.
 *  * Копия этой функции используется в public/sw.js
 */

const fetchMatch = function (request, files) {
  let url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return 'errUrl';
  }
  if (url.pathname.indexOf('/api/') === 0) {
    return 'api';
  }
  if (request.method !== 'GET') {
    return 'other';
  }
  if (request.mode === 'navigate' && request.destination === 'document') {
    const extMatch = /(\.\w+)$/.exec(request.url);
    if (!extMatch || extMatch[1] === '.html' || extMatch[1] === '.htm') {
      return 'offlineIndex';
    }
    return 'other';
  }
  if (files.some(path => url.pathname.indexOf(path) === 0)) {
    return 'offlineStatic';
  }
  return 'other';
};
