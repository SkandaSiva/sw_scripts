const CACHE_NAME = 'flaash-messagerie-cache-v1';
const urlsToCache = [
  'index.php',
  'connexion.css',
  'image/logo.png',
  'offline.html' // Assurez-vous de créer une page offline.html pour les erreurs réseau
];

// Installation du service worker et mise en cache des ressources initiales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(error => {
        console.error('Failed to open cache during install:', error);
      })
  );
  self.skipWaiting();
});

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith('.php')) {
    event.respondWith(
      fetch(event.request).catch(error => {
        console.error('Fetch failed for PHP page:', error);
        return caches.match('offline.html');
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request)
          .then(networkResponse => caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
          )
        ).catch(error => {
          console.error('Fetch failed:', error);
          return caches.match('offline.html'); // Return offline page if fetch fails
        })
    );
  }
});

// Activation du service worker et nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('flaash-messagerie-cache-') &&
                 cacheName !== CACHE_NAME;
        }).map(cacheName => caches.delete(cacheName))
      );
    }).catch(error => {
      console.error('Activation failed:', error);
    })
  );
  self.clients.claim();
});

// Gestion des notifications push
let notificationShown = false;

self.addEventListener('push', event => {
  if (notificationShown) {
    console.log('Notification already shown.');
    return;
  }

  console.log('Push received:', event);
  notificationShown = true;

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Nouvelle notification';
  const options = {
    body: data.body,
    icon: data.icon || 'image/logo.png',
    badge: data.badge || 'image/logo.png',
    data: {
      url: data.url || '/'
    }
  };

  // Afficher la notification
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', event => {
  event.notification.close();
  notificationShown = false;

  const url = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }).catch(error => {
      console.error('Notification click failed:', error);
    })
  );
});

// Garder le service worker actif
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options)
      .then(subscription => {
        // Envoyez le nouvel abonnement au serveur d'application
        console.log('Subscribed after pushsubscriptionchange', subscription);
        // Envoyer le nouvel abonnement au serveur
        return fetch('/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      })
  );
});
