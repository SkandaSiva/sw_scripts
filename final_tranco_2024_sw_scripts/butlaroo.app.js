self.addEventListener(
	'fetch',
	() => {}
);

self.addEventListener(
	'notificationclick',
    event => {
        const url = event.notification.data ? event.notification.data.url : '';
        let urlAlias;

        event.notification.close();

        if (url.substr(-1) === '/') {
            urlAlias = url.slice(0, -1);
        } else {
            urlAlias = url + '/';
        }

        event.waitUntil(
            clients.matchAll({
                type: 'window'
            })
                .then(
                    windowClients => {
                        for (let i = 0; i < windowClients.length; i++) {
                            const client = windowClients[i];

                            if ((client.url === url || client.url === urlAlias) && 'focus' in client) {
                                return client.focus();
                            }
                        }

                        if (clients.openWindow) {
                            return clients.openWindow(url);
                        }
                    }));
    });

self.addEventListener(
    'push',
    event => {
        const data = event.data.text();

        const title = 'Butlaroo';
        const options = {
            badge: '/favicon.ico',
            body: data,
            icon: '/favicon.ico',
        };

        event.waitUntil(self.registration.showNotification(title, options));
    });
