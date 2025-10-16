if (!['localhost'].includes(location.hostname)) {
	importScripts('./ngsw-worker.js')
}

self.addEventListener('notificationclick', event => {
	event.notification.close()

	if (event.notification.data?.type === 'orderStatus') {
		const ordersPage = '/orders'
		const promiseChain = clients.openWindow(ordersPage)
		event.waitUntil(promiseChain)
	}
})
