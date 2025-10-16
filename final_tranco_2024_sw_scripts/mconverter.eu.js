// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

const CACHE = "pwabuilder-page";

const offlineFallbackPage = "offline.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
  event.waitUntil(skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.disable();
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  /* Use Share Targets API to receive files from other apps: */
  if (event.request.method === 'POST' && url.pathname === '/' && url.searchParams.has('share-target')) {
    url.searchParams.delete('share-target');
    // Redirect to allow page refreshing without resending the data:
    // Also pass any other search params (e.g. twa source):
    event.respondWith(Response.redirect('/?receiving-file-share=1&' + url.searchParams.toString()));

    event.waitUntil(async function () {
      const client = await self.clients.get(event.resultingClientId);
      const data = await event.request.formData();
      const files = data.getAll('file');
      client.postMessage({ files });
    }());
    return;
  }

  if (event.request.mode === 'navigate') {
    // Workarounds for the ridiculous amount of hard-to-debug iOS Safari issues:
    if (event.request.url.includes('download.php')) return; // otherwise it downloads files as filename.pdf.html
    if (event.request.url.includes('redirects/')) return; // otherwise the Lax session cookie is not sent https://bugs.webkit.org/show_bug.cgi?id=226386

    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll().then(windowClients => {
      if (windowClients.length) {
        // Execute the notification action, if it was clicked:
        if (['cancel', 'download'].includes(event.action))
          windowClients[0].postMessage({
            type: 'act',
            action: event.action
          });
        
        windowClients[0].postMessage({
          type: 'log',
          event: 'click',
          tag: event.notification.tag
        });

        // In all cases, focus the currently open window:
        return windowClients[0].focus();
      } else if (clients.openWindow) {
        // All windows were closed. Go to conversion history:
        return clients.openWindow('/?from_notification=1#history');
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  event.waitUntil(
    clients.matchAll().then(windowClients => {
      if (windowClients.length)
        windowClients[0].postMessage({
          type: 'log',
          event: 'close',
          tag: event.notification.tag
        });
    })
  );
});