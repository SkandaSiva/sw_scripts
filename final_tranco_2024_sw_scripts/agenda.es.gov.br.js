
self.addEventListener('install', event => { // NOSONAR
    //console.log('SW instalado');
});

self.addEventListener('activate', event => { // NOSONAR
    //console.log('SW ativado');
});

self.addEventListener('fetch', event => { // NOSONAR
    //console.log('fetch interceptado: ', event.request.url);
});