self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

	const dataJSON = event.data.json();
    const notificationOptions = {
        body: dataJSON.body,
		icon: dataJSON.icon,
		data: {
			url: dataJSON.url,
			uniqueid: dataJSON.uniqueid
		}
    };
	fetch("https://notifications.rustica.fr/open.php?uid="+dataJSON.uniqueid);

    return self.registration.showNotification(dataJSON.title, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
	var data = event.notification.data;
	event.notification.close();
	fetch("https://notifications.rustica.fr/click.php?uid="+data.uniqueid);
	return clients.openWindow(data.url);
});