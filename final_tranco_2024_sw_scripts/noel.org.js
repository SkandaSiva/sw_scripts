'use strict';

var CACHE_NAME = 'agendas-v1-alpha';
var OFFLINE_URL = 'offline.html';

const delay = 1000 * 3600 * 6
let sendedAt = null;

// indexedDB --------------------------------------------------------------------------------------

function getLastSent() {
  if (sendedAt) {
    return sendedAt;
  }

  const openRequest = indexedDB.open('serviceworker', 1);
  openRequest.onupgradeneeded = () => {
    const db = openRequest.result;
    if (!db.objectStoreNames.contains('push')) {
      db.createObjectStore('push', {keyPath: 'id'});
    }
  };

  return new Promise((resolve) => {
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const tx = db.transaction('push', 'readonly');
      const store = tx.objectStore('push');
  
      const request = store.get(0);
      tx.oncomplete = () => {
        db.close();
        
        sendedAt = request?.result?.sendedAt ?? null;
        resolve(sendedAt);
      }
    }
  });
}

async function antispam() {
  const now = Date.now();
  const lastSentAt = await getLastSent();
  if (lastSentAt && (lastSentAt + delay > now)) {
    return true;
  }

  sendedAt = now;
  const openRequest = indexedDB.open('serviceworker', 1);
  openRequest.onsuccess = () => {
    const db = openRequest.result;
    const tx = db.transaction('push', 'readwrite');
    const store = tx.objectStore('push');
    store.put({ id: 0, sendedAt });
    tx.oncomplete = () => {
      db.close();
    }
  };
  return false;
}

// service worker ---------------------------------------------------------------------------------

self.addEventListener('install', function(event) {
    self.skipWaiting();

    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
    })());

    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('[ServiceWorker] Activate');
    event.waitUntil((async () => {
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })());
    self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // console.log('[Service Worker] Fetch', event.request.url);
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        console.log('[Service Worker] Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  }
});

// NOTIFICATIONS PUSH
async function sendNotif(event) {
  const now = Date.now();
  const content = event.data.json();

  // Antispam
  if (content.data.antispam && await antispam()) {
    return;
  }

  const options = {
    body: content.data.body,
    data: {
      url: content.data.url ?? '/user/compte',
      dateOfArrival: now,
    },
    icon: `/images/theme/${content.data.agenda}/logo.svg`,
    badge: `/images/theme/${content.data.agenda}/logo.svg`,
  }

  return self.registration.showNotification(content.data.title, options);
}

self.addEventListener('push', async (event) => {
  event.waitUntil(
    sendNotif(event)
  );
});
  
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
  
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  }).then((windowClients) => {
    let matchingClient = null;
    for (let i = 0; i < windowClients.length; i += 1) {
      const windowClient = windowClients[i];
      if (windowClient.url === urlToOpen) {
        matchingClient = windowClient;
        break;
      }
    }

    if (matchingClient) {
      return matchingClient.focus();
    }
    return clients.openWindow(urlToOpen);
  });

  event.waitUntil(promiseChain);
});
  
