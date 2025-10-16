importScripts("https://js.pusher.com/beams/service-worker.js");

const CACHE_NAME = 'V3.2';
const STATIC_CACHE_URLS = [
    './css/nucleo/css/nucleo.css',
    './css/argon/argon.css',
    './css/app/custom-select.css',
    './css/style.css',
    './css/app/tijolos.css',
    './css/font-awesome-4.7.0/css/font-awesome.min.css',
    './js/jquery-3.2.1.min.js',
    './js/bootstrap.min.js',
    './js/modulos/tijolos.js',
    './js/app/index.js',
    './js/modulos/custom-carousel.js',
    './js/modulos/custom-select.js',
    './manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        (async() => {
            try {
                let cache_obj = await caches.open(CACHE_NAME)
                cache_obj.addAll(STATIC_CACHE_URLS)
            }
            catch {
                console.log("Erro no cache.")
            }
        })()
    )});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(cached => {
            return cached || fetch(event.request)
        })
    )
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
        .then(keys => keys.filter(key => key !== CACHE_NAME))
        .then(keys => Promise.all(keys.map(key => {
            return caches.delete(key)
        })))
    )
})