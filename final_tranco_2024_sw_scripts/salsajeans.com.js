const CACHE_NAME = 'custom-cache-v1';

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting()); // Ativa o SW imediatamente ap�s a instala��o
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Controla todas as p�ginas imediatamente
});

// Intercepta requisi��es e controla o cache de arquivos .svg, .woff e /sysimages
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Verifica se o recurso � .woff, .svg ou est� na pasta /sysimages
  if (url.endsWith('.woff') || url.endsWith('.svg') || url.includes('/sysimages/')) {
    event.respondWith(
      // Verifica se a sess�o j� foi marcada
      clients.matchAll({ type: 'window' }).then(clients => {
        const isSessionActive = clients.some(client => client.url.includes('sessionCheck'));

        // Se � o in�cio de uma nova sess�o, verifica no servidor e armazena no cache
        if (!isSessionActive) {
          return fetchAndCache(event.request);
        } else {
          // Caso contr�rio, serve direto do cache, se dispon�vel
          return caches.match(event.request).then(response => {
            return response || fetchAndCache(event.request);
          });
        }
      })
    );
  }
});

// Fun��o auxiliar para buscar da rede e adicionar ao cache
function fetchAndCache(request) {
  return fetch(request).then(networkResponse => {
    const responseClone = networkResponse.clone();
    caches.open(CACHE_NAME).then(cache => {
      cache.put(request, responseClone);
    });
    return networkResponse;
  });
}
