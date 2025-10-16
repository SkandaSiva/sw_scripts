let landingIds = {
	6: "https://www.jeevansathi.com/mymatches",
	7: "https://www.jeevansathi.com/mymatches",
};

let envParams = {};
if (self) {
	self.addEventListener("message", function (event) {
		envParams = event.data;
	});
	let notificationTrackingObject = {};
	self.addEventListener("push", (event) => {
		const notification = event.data.json().data;
		notificationTrackingObject = {
			notificationKey: notification.NOTIFICATION_KEY,
			messageId: notification.MSG_ID,
			parentId: notification.parentId,
			deliveredTs: Date.now(),
		};
		notificationDelivery([notificationTrackingObject]);
		let pageUrl = `${landingIds[+notification.LANDING_SCREEN]}?messageId=${
			notification.MSG_ID
		}&source=PUSH_NOTIFICATION&key=${notification.NOTIFICATION_KEY}&parentId=${
			notification.parentId
		}`;
		event.waitUntil(
			self.registration.showNotification(notification.TITLE, {
				body: notification.MESSAGE,
				icon:
					notification.PHOTO_URL ??
					"https://static.jeevansathi.com/images/JSLogo.png",
				data: {
					url: pageUrl,
				},
			})
		);
	});

	self.addEventListener("notificationclick", async (event) => {
		event.preventDefault();
		event.waitUntil(clients.openWindow(event.notification.data.url));
	});
}

function notificationDelivery(data) {
	let url = envParams?.apiGateway
		? envParams.apiGateway
		: "https://www.jeevansathi.com/app-gateway";
	let device = envParams?.deviceType ? envParams.deviceType : "JSPC";
	fetch(`${url}/notification/track/v2/delivery`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"JS-User-Agent": device,
			"Content-Type": "application/json",
		},
	});
}
