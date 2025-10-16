function randomStr() {
	return Math.random().toString(36).substr(2);
}

function report(action, title = '', body = '', id = '', options = {}) {
	// 使用 fetch 请求获取缓存中的数据
	return caches
		.open('myCache')
		.then(function (cache) {
			return cache.match('clientId').then(function (response) {
				if (response) {
					return response.json().then(function (data) {
						// 处理缓存中的数据
						const cid = data.startsWith('cid-') ? data.split('-').pop() : data;
						return cache.match('instanceId').then(function (response) {
							if (response) {
								return response.json().then(async function (data) {
									// click、close
									if (action !== 'receive') {
										options = await getOptions();
									}
									// Measurement Protocol
									fetch(
										'https://www.google-analytics.com/mp/collect?api_secret=nSUqwfDIRYCHAa-PV8gS5Q&measurement_id=G-3TZLKYJJ0E',
										{
											method: 'POST',
											body: JSON.stringify({
												client_id: cid,
												events: [
													{
														name: 'fb_webpush',
														params: {
															install_id: data,
															action: action,
															title: title,
															body: body,
															label: options?.label || '',
															message_id: options?.message_id || '',
															push_msg_id: id,
														},
													},
												],
											}),
										}
									);
								});
							}
						});
					});
				}
			});
		})
		.catch(() => {
			fetch(
				'https://www.google-analytics.com/mp/collect?api_secret=nSUqwfDIRYCHAa-PV8gS5Q&measurement_id=G-3TZLKYJJ0E',
				{
					method: 'POST',
					body: JSON.stringify({
						client_id: `no-cid-${randomStr()}`,
						events: [
							{
								name: 'fb_webpush',
								params: {
									install_id: `no-installId-${randomStr()}`,
									action: action,
									title: title,
									body: body,
									label: options?.label || '',
									message_id: options?.message_id || '',
									type: 'error',
									push_msg_id: id,
								},
							},
						],
					}),
				}
			);
		});
}

function getOptions() {
	return caches.open('myCache').then(function (cache) {
		return cache.match('options').then(function (response) {
			if (response) {
				return response.json();
			}
		});
	});
}

self.addEventListener('install', function (event) {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
	event.waitUntil(self.clients.claim());
});

self.addEventListener('message', function (event) {
	// 获取clientId 存到cache中
	event.waitUntil(
		caches.open('myCache').then((cache) => {
			if (event.data?.instanceId) {
				cache.put(
					'instanceId',
					new Response(JSON.stringify(event.data?.instanceId))
				);
			}
			if (event.data?.clientId) {
				cache.put(
					'clientId',
					new Response(JSON.stringify(event.data?.clientId))
				);
			}
		})
	);
});

// 当用户点击通知时触发
self.addEventListener(
	'notificationclick',
	function (event) {
		const notification = event.notification;
		const jumpUrl = notification.data.url || 'https://www.wps.com';
		// event.waitUntil(clients.openWindow(jumpUrl))
		notification.close();
		if (event.action === 'btn_click') {
			clients.openWindow(notification.data.button_click);
		} else {
			clients.openWindow(jumpUrl);
		}
		event.waitUntil(
			report('click', event.notification.title, event.notification.body)
		);
	},
	false
);

// 接收到推送消息时触发
self.addEventListener('push', function (event) {
	const payload = event.data.json();
	const notificationTitle = payload.notification.title;
	const notificationClickJumpUrl = payload.data.url;
	const notificationButton =
		payload.data.button_name && payload.data.button_click
			? [
					{
						action: 'btn_click',
						title: payload.data.button_name,
					},
			  ]
			: undefined;
	const notificationOptions = {
		body: payload.notification.body,
		icon: payload.notification.image,
		image: payload.data.banner_image,
		actions: notificationButton,
		data: {
			url: notificationClickJumpUrl,
			button_click: payload.data.button_click,
		},
	};
	const options = {
		label: payload?.fcmOptions?.analyticsLabel || '',
		message_id: payload?.fcmMessageId || '',
	};
	return event.waitUntil(
		Promise.all([
			self.registration.showNotification(
				notificationTitle,
				notificationOptions
			),
			report(
				'receive',
				payload.notification.title,
				payload.notification.body,
				payload.data.push_msg_id,
				options
			),
			caches
				.open('myCache')
				.then((cache) =>
					cache.put('options', new Response(JSON.stringify(options)))
				),
		])
	);
});

// 用户关闭通知时触发
self.addEventListener('notificationclose', function (event) {
	//  埋点 - 关闭
	event.waitUntil(
		report('close', event.notification.title, event.notification.body)
	);
});
