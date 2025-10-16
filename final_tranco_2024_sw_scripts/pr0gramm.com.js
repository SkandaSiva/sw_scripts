/// <reference lib="webworker" />
// @ts-check

// TODO: https://web.dev/articles/push-notifications-common-notification-patterns

self.addEventListener("push", (e) => {
	const handle = async () => {
		const notificationData = e.data.json();
		await self.registration.showNotification(
			notificationData.title,
			notificationData.options,
		);
		await updateBadge();
	};
	e.waitUntil(handle());
});

self.addEventListener("notificationclick", (e) => {
	// Ref on main part of this code: https://stackoverflow.com/a/39457287
	if (!e.notification) {
		return;
	}
	// If the browser supports actions and the notification has some, we want to use that
	// See: https://developer.mozilla.org/en-US/docs/Web/API/Notification/actions

	// Currently, we only support opening a URL, but that may change (action id: "open-url").
	// The only browser that supports actions is Chrome, so opening a URL will be pretty much the only thing for now

	// Also, we currently only support a single action per notification. Chrome supports at most two actions and all other browsers don't support _anything_.
	// CanIUse: https://caniuse.com/mdn-api_notification_actions
	// Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1225110
	// Chrome: https://developer.chrome.com/blog/notification-actions/ + https://pushpad.xyz/docs/action_buttons

	// Actually, we can always use the fallback for this action and just pretend we handle the action :>

	if (
		!e.notification.data ||
		!e.notification.data.actionData ||
		!e.notification.data.actionData.url
	) {
		// No URL to open here, just close the notification
		e.notification.close();
		return;
	}

	if (!!e.action && e.action !== "open-url" && !!e.notification.actions) {
		// The user clicked on a non-supported action and there were actions
		return;
	}

	// If the user didn't click on any action (just the notification),
	// or if the user clicked on the only action (open-url), we want to open the URL

	const url = e.notification.data.actionData.url;
	const handle = async () => {
		await clients
			.matchAll({ includeUncontrolled: true, type: "window" })
			.then(async (windowClients) => {
				// Check if there is already a window/tab open with the target URL
				for (const client of windowClients) {
					if (client.url === url && "focus" in client) {
						// If so, just focus it.
						e.notification.close();
						return client.focus();
					}
				}

				// If not, then open the target URL in a new window/tab.
				if (clients.openWindow) {
					e.notification.close();
					await clients.openWindow(url);
				}
			})
			.catch((err) => {
				console.error("Failed to handle notification click", err);
			});

		const ackEndpoint = e.notification.data?.acknowledge?.endpoint ?? undefined;
		if (ackEndpoint) {
			if (typeof navigator.sendBeacon === "function") {
				navigator.sendBeacon(ackEndpoint);
			} else {
				await fetch(ackEndpoint, {
					method: "GET",
				}).catch(() => console.error("Failed to acknowledge notification"));
			}
		}
		
		await new Promise((res, rej) => {
			setTimeout(() => updateBadge().then(res), 1000);
		});
	};

	e.waitUntil(handle());
});

async function updateBadge() {
	if (typeof navigator.setAppBadge !== "function") {
		  return;
		}
			await fetch("/api/inbox/pending")
				.then((res) => res.json())
				.then((data) => {
					const totalUnseen =
						data.messages.filter((m) => !m.read).length +
						data.digests.filter((d) => !d.read).length;
					try {
						navigator.setAppBadge(totalUnseen);
					} catch {
						console.error("Failed to set badge count");
					}
				})
				.catch((err) => {
					console.log("Unable to fetch pending inbox messages", err);
					try {
						navigator.setAppBadge(0);
					} catch {
						console.error("Failed to set badge count");
					}
				});
	}

// Empty fetch handler, so we can install the page without adding caching logic (yet)
// Commented out for now, because we don't want the legacy frontend to be "installed"
// self.addEventListener("fetch", () => {});
