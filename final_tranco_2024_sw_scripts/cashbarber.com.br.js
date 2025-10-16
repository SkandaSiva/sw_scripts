
/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="webworker"/>

const sw = /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (
	globalThis
);

sw.addEventListener('push', (event) => {
	const message = event.data?.json();
	const { title, body, icon, image, channelId } = message;

	async function handlePushEvent() {
		const windowClients = await sw.clients.matchAll({ type: 'window' });

		if (windowClients.length > 0) {
			const appInForeground = windowClients.some(client => client.focused);

			if (appInForeground) {
				return;
			}
		}

		await sw.registration.showNotification(title, {
			body,
			icon,
			image,
			badge: icon
		})
	}

	event.waitUntil(handlePushEvent());
});