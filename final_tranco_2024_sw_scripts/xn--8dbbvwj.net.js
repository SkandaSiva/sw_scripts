
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker.....', event);
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker.....', event);
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    console.log('[Service Worker] Fetch initiated.....',event);
    event.respondWith(fetch(event.request));
});
self.addEventListener('notificationclick', function (event) {
  console.log("notificationclick");
  event.notification.close();
});
self.addEventListener('error', function(e) {
  console.log(e.filename, e.lineno, e.colno, e.message);
    fetch("logerror.php", {
    method: "POST",
    body: JSON.stringify({
      error: JSON.stringify(e),
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
});

