// Variável para armazenar o nome do cache
const cacheName = 'pwa-version-1';


// Evento message do Service Worker
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'skipWaiting') {
        self.skipWaiting();
    }
});

// Evento de instalação do Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                // Faz o cache das páginas e recursos iniciais
                return cache.addAll([
                    '/'
                ]);
            })
            .then(() => self.skipWaiting()) // Pula para a próxima fase do ciclo de vida do Service Worker
    );
});

// Evento fetch do Service Worker
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    if (event.request.method !== 'POST') {
        event.respondWith(
            caches.open(cacheName)
                .then(cache => {
                    return cache.match(event.request)
                        .then(cachedResponse => {
                            const fetchPromise = fetch(event.request)
                                .then(fetchResponse => {
                                    if (fetchResponse && fetchResponse.status === 200) {
                                        // Clona a resposta para armazenar em cache
                                        const responseToCache = fetchResponse.clone();
                                        cache.put(event.request, responseToCache); // Armazena a resposta em cache
                                    }
                                    return fetchResponse;
                                })
                                .catch(() => {
                                    if (cachedResponse) {
                                        return cachedResponse; // Retorna a resposta em cache em caso de falha na solicitação de rede
                                    }
                                });

                            // Verifica se a versão atualizada está disponível e, se sim, busca essa versão
                            if (navigator.onLine) {
                                return fetchPromise;
                            }

                            // Se não estiver online, retorna a resposta em cache
                            return cachedResponse || fetchPromise;
                        });
                })
        );
    }
});

// Evento de ativação do Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== cacheName)                    
                    .map(name => caches.delete(name))
            );
        }).then(() => {
            if (self.clients && self.clients.claim) {
                return self.clients.claim();
            }
        })
    );
});

// Verifique se o evento "beforeinstallprompt" está disponível no navegador
if ('serviceWorker' in navigator && 'beforeinstallprompt' in window) {
    // Adicione um ouvinte de evento para o evento "beforeinstallprompt"
    window.addEventListener('beforeinstallprompt', (e) => {
        // Cancelar o evento para evitar que o banner padrão seja exibido automaticamente
        e.preventDefault();
    });
}