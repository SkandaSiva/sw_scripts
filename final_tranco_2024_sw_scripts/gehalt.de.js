var track = function (type, data) {
    fetch(self.location.origin + "/push-notifications/events", {
        method: 'post',
        headers: { "Content-type": "application/json;charset=UTF-8" },
        body: JSON.stringify({
            type: type.toUpperCase() || null,
            location: data.location || null,
            searchText: data.title || null,
            source: data.source || null,
            pushNotificationID: data.pushNotificationID || null,
            pushNotificationRunId: data.pushNotificationRunId || null,
            pushNotificationPlatformType: data.pushNotificationPlatformType || null,
            pushNotificationMessageType: data.pushNotificationMessageType || null
        })
    })
    .then(function (data) {
        console.log('Request succeeded with JSON response', data);
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
};

var generateOptions = function(data, body) {
	return {
		body: body,
		icon: self.location.origin + '/images/serviceworker/gde_serviceworker.png',
		badge: self.location.origin + '/images/serviceworker/PushN-GDE-250x250-grey.png',
		vibrate: [100, 50, 100],
		requireInteraction: true,
		data: data
	};
};

self.addEventListener('push', function(event) {
    var data = JSON.parse(event.data.text()),
        title, options,
        location_text = (data.location != null && data.location != "") ? " in " + data.location : "",
        action_buttons = [];

    title = data.headline;
    options = generateOptions(data, data.adTitle + location_text);

    // ACTIONS-BUTTONS definieren
    action_buttons.push({action: 'action', title: data.buttonLabel});

    // ACTIONS-BUTTONS hinzufügen
    options.actions = action_buttons;

	const notificationPromise = self.registration.showNotification(title, options);
    track("show", data);
    event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function(event) {
    console.log(event);
    clients.openWindow(event.notification.data.link);
    event.notification.close();
});

self.addEventListener('notificationclose', function(event) {
    console.log(event);
    track("close", event.notification.data);
    event.notification.close();
});