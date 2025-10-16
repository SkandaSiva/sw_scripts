self.notifications_queue = [];
self.promise = null;
self.fallback = {
    icon: null,
    badge: null,
};

self.T = {
	async trackEvent(payload) {
		try {
			await fetch("https://2rnotxniby6ak2owajunkc2q4i0roczy.lambda-url.eu-west-1.on.aws/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				cache: "no-cache",
				body: JSON.stringify(payload),
			});
		} catch (e) {
			console.error(e);
			throw(e);
		}
	},
}

self.addEventListener('install', function (event) {
    console.log("[ServiceWorker] Installed");
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    console.log("[ServiceWorker] Activated");

    self.clients.matchAll({
        includeUncontrolled: true
    }).then(function (clientList) {
        var urls = clientList.map(client => client.url);
        console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', function (event) {
    var message = event.data;
    console.log('[ServiceWorker] Message received', message);
});

self.addEventListener('push', function (event) {

    var payload = event.data.json();
    console.log('[ServiceWorker] Push notification received', payload);

    var options = {
        body: (payload.notification.body || null),
        icon: (payload.notification.icon || self.fallback.icon),
        badge: (payload.data.badge || self.fallback.badge),
        image: (payload.data.image || null),
        data: payload.data.data,
    };
    console.log('[ServiceWorker] Options', options);

    let data = JSON.parse(payload.data.data);

    self.T.trackEvent({
        e: 'deliver',
        l: data.notification_id,
        t: Date.now(),
    });

    self.notifications_queue.unshift({ title: payload.notification.title, options });
    self.notifications_queue = self.notifications_queue.slice(0, 1);
    self.notifications_queue_timestamp = Math.floor(Date.now() / 1000);

    if (self.promise === null) {
        self.promise = new Promise(self.runQueue);
    }

    event.waitUntil(self.promise);
});

self.runQueue = function (resolve, reject) {
    self.interval = setInterval(function() {

        if (self.notifications_queue_timestamp + 3 < Math.floor(Date.now() / 1000)) { //aspetta 3 sec dall'ultima notifica ricevuta per mostrare le notifiche in coda

            var promise_list = [];
            for (var i = 0; i < self.notifications_queue.length; i++) {
                promise_list.push(self.registration.showNotification(self.notifications_queue[i].title, self.notifications_queue[i].options));
            }

            self.notifications_queue = [];
            clearInterval(self.interval);
            self.promise = null;

            Promise.all(promise_list).then(function () {
                resolve();
            });
        }
    }, 1000);
};

self.addEventListener('notificationclick', function (event) {

    let payload = JSON.parse(event.notification.data);
    console.log('[ServiceWorker] On notification click', payload);
    event.notification.close();

    self.T.trackEvent({
        e: 'click',
        l: payload.notification_id,
        t: Date.now(),
    });

    if (payload.click_action !== undefined) {
        //deve sempre aprire una nuova finestra per permettere il tracciamento di analytics e dei click delle notifiche sul singolo token
        event.waitUntil(
            self.clients.openWindow(payload.click_action)
        );
    }
});
