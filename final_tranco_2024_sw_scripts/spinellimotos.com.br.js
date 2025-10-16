
console.warn('ServiceWorker: Registrando...');

self.addEventListener('install', (event) => {
    console.warn('ServiceWorker: Instalando...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.warn('ServiceWorker: Ativando...');
    return self.clients.claim();
});

self.addEventListener('fetch', function(event){
    // Start Url Only to make App Instalable
    if ( event.request.method === 'GET' && event.request.url.match(/\/$/) ) {
        console.warn('ServiceWorker: Fetch...', event);
        return  event.respondWith(fetch(event.request));
    }
});