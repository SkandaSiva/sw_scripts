/*var CACHE_NAME = 'edubenchmark';
var urlsToCache = [
  'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,600,600i,700,700i,900,900i',
  'https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i,800,800i',
  'https://fonts.googleapis.com/css?family=Work+Sans:400,500,600,700,800,900',
  './css/style.css',
  './css/bootstrap.min.css',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  './js/bootstrap.min.js',
  './slick/ajax-loader.gif',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
  './js/main.js',
  './js/mc-validate.js',
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('fetch', event => {
  console.log("(9)served from service worker: ",event.request.url);
  event.respondWith(fromCache(event.request));
  event.waitUntil(  
    update(event.request)
  );
});

function fromCache(request) {
  return caches.open(CACHE_NAME).then(cache => {
    return cache.match(request);
  });
}
function update(request) {
  caches.open(CACHE_NAME).then( cache => {
    fetch(request).then( response => {
      cache.put(request, response)
    });
  });
}*/