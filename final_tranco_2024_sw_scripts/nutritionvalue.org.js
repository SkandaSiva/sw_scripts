const resources = [
	'/images/social/combined.png',
	'/images/logo.png',
	'/images/foods/40/apple.png',
	'/images/foods/70/apple.png',
	'/images/foods/140/apple.png'
]

self.addEventListener('install', function(event) {  
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll(resources);
		})
	);
});

self.addEventListener('activate', function(event) {
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

var diaryUrl = '/diary.php';

self.addEventListener('push', function(event) {
  const payload = event.data ? event.data.text() : 'no payload';
  event.waitUntil(
  		self.registration.showNotification('Daily reminder', {
      		body: payload,
          icon: '/images/pages/diary.png',
					tag: 'nv-diary-notification'
      })
  );
});

self.addEventListener('notificationclick', function(event) {
	event.notification.close();

  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url.endsWith(diaryUrl) && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow(diaryUrl);
  }));
});

