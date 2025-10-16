self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/offline.html',
        '/kontakt.html',
		'/img/aipi_visitenkarte_mit_kugelschreiber_85.jpg',
		'/grafik/logo200.png',
		'/img/mitgliedsunternehmen_im_bvmw_94.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {


if (event.request.mode !== 'navigate') {
  // Not a page navigation, bail.
  return;
}
event.respondWith(
    fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
              .then((cache) => {
                return cache.match('offline.html');
              });
        })
);

});

/*
// CODELAB: Update cache names any time any of the cached files change.
const FILES_TO_CACHE = [
  '/offline.html',
];
// CODELAB: Precache static resources here.
evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
);
*/