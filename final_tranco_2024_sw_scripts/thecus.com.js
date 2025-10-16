const pwaCache = 'Thecus0.0.0';


const staticCache = [
  '/',
];


self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(pwaCache)
    .then(cache => cache.addAll(staticCache))
  );
});


self.addEventListener('activate', (e) => {
  let cacheCleaned = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== pwaCache) return caches.delete(key);
    });
  });
  e.waitUntil(cacheCleaned);
});


self.addEventListener('fetch', (e) => {

  let res = caches.match(e.request).then((res) => {

    if (res) return res;

    return fetch(e.request).then((fetchRes) => {

      caches.open(pwaCache).then(cache => cache.put(e.request, fetchRes));

      return fetchRes.clone();
    });
  });

  e.respondWith(res);
});
