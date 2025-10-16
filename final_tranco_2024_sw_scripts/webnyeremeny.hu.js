(() => {
	'use strict'

	const WebPush = {
		data: {},
		init () {
			self.addEventListener('push', this.notificationPush.bind(this))
			self.addEventListener('notificationclick', this.notificationClick.bind(this))
		},

		/**
		 * Handle notification push event.
		 * https://developer.mozilla.org/en-US/docs/Web/Events/push
		 * @param {NotificationEvent} event
		 */
		notificationPush (event) {
			if (!(self.Notification && self.Notification.permission === 'granted')) {
				return
			}
			// https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData
			if (event.data) {
				event.waitUntil(
					this.sendNotification(event.data.json())
				)
			}
		},
		/**
		 * Send notification to the user.
		 * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
		 * @param {PushMessageData|Object} data
		 */
		sendNotification (data) {
			this.data = data;
			console.log('sendNotification', data);
			return self.registration.showNotification(data.title, data)
		},

		/**
		 * Handle notification click event.
		 * https://developer.mozilla.org/en-US/docs/Web/Events/notificationclick
		 * @param {NotificationEvent} event
		 */
		notificationClick (event) {
			const action = event.action || (this.data.actions[0] || {}).action;
			if (action) {
				self.clients.openWindow('https://webnyeremeny.hu/' + action)
			} else {
				self.clients.openWindow('/')
			}
		}
	}

	WebPush.init();
})()