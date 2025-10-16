self.addEventListener('push', function(event) {
		fetch('https://duchuymobile.com/index.php?dispatch=wk_push_notification.get_data_payload', {
			mode: 'cors'
		}).then(function(response) {
			return response.text();
		}).then(function(ret_content) {
			dataa = JSON.parse(ret_content);
			return self.registration.showNotification(dataa.title, {
				body: dataa.body,
				icon: dataa.icon,
				vibrate: 1,
				data: dataa
			});
		});
	});
	self.addEventListener('notificationclick', function(event) {
		var url = event.notification.data.target_url;
		if(url){
			event.notification.close();
			event.waitUntil(clients.matchAll({
				type: 'window'
			}).then(function(windowClients) {
				if (clients.openWindow) {
					return clients.openWindow(url);
				}
			}));
		}
	});