function showNotification(body) {
    let data = {};
    let message = 'BoltzMessenger';
    try {
        console.log(body);
        data = JSON.parse(body);
        message = data['alert'];
        imageUrl = data['ImageURL'];
    }
    catch (e) {
    }

    return self.registration.showNotification(message.title, {
        icon: imageUrl,
        image: imageUrl,
        vibrate: [400,100,400],
        data: data,
        body: message.description,
    });
}

function requestMessagesReload() {
    return self.clients.claim()
        .then(function() {
            return findTabs();
        })
        .then(function(tabs) {
            return Promise.all(tabs.map(function(tab) {
                return tab.postMessage({event: 'reloadMessages'});
            }));
        });
}

function receivePush(evt) {
    let data = '';

    if(evt.data) {
        data = evt.data.text();
    }
    if('showNotification' in self.registration) {
        evt.waitUntil(showNotification(data)
            .then(requestMessagesReload));
    }
}

function openNotifyHpp(evt) {
    let data = evt.notification.data;
    evt.notification.close();
    return self.clients.openWindow(data.URL);
}

function findTabs() {
    let baseUrl = self.registration.scope;
    return self.clients.claim()
        .then(function() {
            return clients.matchAll({ type: 'window', frameType: 'top-level' });
        })
        .then(function(windowClients) {
            let target = windowClients.filter((client) => {
                let path = client.url.substring(baseUrl.length);
                if (path === "") {
                    return true;
                }
                if (path === "channels") {
                    return true;
                }
                if (path === "segments") {
                    return true;
                }
                if (path.match(/^messages(\/\d+)?$/) !== null) {
                    return true;
                }
                return false;
            });
            if (target.length > 0) {
                return target;
            }
            return [];
        });
}

self.addEventListener('push', receivePush, false);
self.addEventListener('notificationclick', openNotifyHpp);