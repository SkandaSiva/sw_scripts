if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js', {scope: '/'})
            .then(registration => {
                console.log('Service Worker registrado exitosamente:', registration.scope);
            })
            .catch(err => {
                console.error('Fallo en el registro del Service Worker:', err);
            });
    });
}
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open("v1")
            .then((cache) =>
                cache.addAll([
                    '/assets/portal-corporativo/js/lib/mdb/mdb.min.js',
                    '/assets/portal-corporativo/js/lib/splide/splide.min.js',
                    '/assets/portal-corporativo/js/lib/mdb-6/plugins/inputmask.min.js',
                    '/assets/portal-corporativo/js/lib/sweet-alert/sweetalert2.all.min.js',
                    '/assets/portal-corporativo/css/lib/sweet-alert/sweetalert2.min.css'
                ]),
            ),
    );
});

self.addEventListener('fetch', event => {
    var url = event.request.url;

    if (url.startsWith('chrome-extension://')) {
        return; // No almacenar en caché URLs con chrome-extension://
    }
    if (event.request.method === 'GET') {

        event.respondWith(
            fetch(event.request).then(networkResponse => {
                // Solo almacenamos en caché si la respuesta es exitosa (status 200)
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Clonar la respuesta para que podamos usar una copia tanto para cachear como para responder
                let responseClone = networkResponse.clone();

                caches.open('v1').then(cache => {
                    cache.put(event.request, responseClone).catch(err => {
                        console.error('Error al almacenar en caché:', err);
                    });
                });

                return networkResponse;
            }).catch(error => {
                // Si la red falla, podrías intentar devolver una respuesta en caché
                console.error('Error en el fetch:', error);
                return caches.match(event.request).then(cachedResponse => {
                    return cachedResponse || new Response('Contenido no disponible offline.');
                });
            })
        );
    }
});

