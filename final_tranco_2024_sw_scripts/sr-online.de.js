self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    if (event.data) {
        const srpush = event.data.text();
        var srpushObj = JSON.parse(srpush);
    }

    const sendNotification = body => {
        // you could refresh a notification badge here with postMessage API
        const title = srpushObj['msg'];

        if(srpushObj['image'] === undefined) {
            srpushObj['image'] = "https://www.pushcf.de/img/sr_icon.png";
        }

        if(srpushObj['badge'] === undefined) {
            srpushObj['badge'] = "https://www.sr.de/sr/static/svg/logos/SRde_white.svg";
        }

        if(srpushObj['attImage'] === undefined) {

            return self.registration.showNotification(title, {
                body,
                icon: srpushObj['image'],
                badge: srpushObj['badge'],
                tag: "sr-push-notification-" + srpushObj['id'],
                data: {
                    url: srpushObj['url']
                }
            });
        } else {
            return self.registration.showNotification(title, {
                body,
                icon: srpushObj['image'],
                image: srpushObj['attImage'],
                badge: srpushObj['badge'],
                tag: "sr-push-notification-" + srpushObj['id'],
                data: {
                    url: srpushObj['url']
                }
            });
        }

        console.log(srpushObj['image']);

        console.log(srpushObj);

        console.log("with image tag");
    };

    if (event.data) {

        event.waitUntil(sendNotification(srpushObj['nachricht']));
    }

    // Auf Seite anzeigen.
    event.waitUntil(async function() {

        self.clients.matchAll().then(function (clients){
            clients.forEach(function(client){
                client.postMessage({
                    msg: srpushObj['msg'],
                    url: srpushObj['url'],
                    kat: srpushObj['kategorie']
                });
            });
        });

    }());

});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data['url'])
    );
});


self.addEventListener('fetch', event => {

});

/*function formatUrl(url, queries) {
    const prefix = url.includes('?') ? '&' : '?';
    const query = Object.keys(queries).map(function (key) {
        return `${key}=${queries[key]}`;
    }).join('&');
    return url + prefix + query;
}*/
