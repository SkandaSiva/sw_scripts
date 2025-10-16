const version = "0.0.01";
const cacheName = 'innovana-${version}';

var filesToCache = [
    '/css/',
    '/js/',
    'https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i,900,900i&display=swap',    
	'https://webcf.quickdriverupdater.com/win/qdu/website/'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(cacheName).then(cache => {
            return cache.addAll(filesToCache);
    }).then((r) => {
              self.skipWaiting()
              return r;
    }).catch(console.error));
});


self.addEventListener('activate', event => {
    self.clients.claim();

    event.waitUntil(caches.keys().then(function(keyList) {
        return Promise.all(keyList.filter(function(key) {
            return key != cacheName;
        }).map(function(key){
            return caches.delete(key);
        }));        
    }));
});


self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        }));
});