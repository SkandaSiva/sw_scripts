// Version du chache
const VERSION = "v1";

// Nom du cache
const CACHE_NAME = 'AFEDIM-SW-' + VERSION;

// Ressources necessaires a l'application
const APP_STATIC_RESOURCES = [
    "/",
    "/index.html",
    "/doc.html",
];

// A l'install, mise en cache des resources static
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(APP_STATIC_RESOURCES);
        })(),
    );
});

// A l'activation, supression ancien cache
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                }),
            );
            await clients.claim();
        })(),
    );
});

// A l'interception des requests au server
// On repond avec les reponses en cache plutot que d'aller vers le serveur 
self.addEventListener("fetch", (event) => {

    // Pour toutes requests, on regarde le cache en premier, puis le serveur network
    /*event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request);

            if (cachedResponse) {
                // Return reponse du cache si dispo
                return cachedResponse;
            }

            const reponse = await fetch(event.request);

            if (!(reponse.status === 0)){
                cache.put(event.request, reponse.clone());
            } 
            return reponse;
        })(),
    );*/
});