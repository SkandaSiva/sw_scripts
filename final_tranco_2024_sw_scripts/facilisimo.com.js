/* facilisimoDeveloper: davids */
self.addEventListener('push',function(event){
	console.log('[Service Worker] Push Received.',event);
	var obj = JSON.parse(event.data.text());
	//console.log('[Service Worker] Push had this data: "${event.data.text()}"');
	event.waitUntil(self.registration.showNotification(obj.title,obj.options));
});


self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
	clients.openWindow(event.notification.data.url)
  );
});
