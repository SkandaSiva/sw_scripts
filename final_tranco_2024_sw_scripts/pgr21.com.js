/* pgr21 서비스 워커 by Jinsung 17.0717 */

self.addEventListener('push', function(event) {
	console.log('[Service Worker] Push Received.');
	//console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
	var payload = JSON.parse(event.data.text());

	const title = payload.title;
	const options = {
		body: payload.body,
		icon: '/favicon.ico',
		data: payload,
		requireInteraction: true
	};
	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
	console.log('[Service Worker] Notification click Received.');
	var url = extractHostname(event.notification.data.url) + '/pb/member_notice_ajax.php?id=' + event.notification.data.id;
	fetch(url, {
		method: 'GET',
		credentials: 'same-origin'
	})
	.catch(function (error) {  
		console.log('Request failed', error);  
	});
	event.notification.close();
	event.waitUntil(
		clients.openWindow(event.notification.data.url)
	);
});

function extractHostname(url) {
    var hostname;
    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}