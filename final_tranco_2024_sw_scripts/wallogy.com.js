
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('wallogy.v1').then(function (cache) {
            return cache.addAll([
                'offline.html'
            ]);
        }),
    );
});

self.addEventListener('activate', function (event) { });

/* We decided to no longer support an offline mode
self.addEventListener('fetch', (event) => {
    if (navigator.onLine === false) {
        var url = new URL(event.request.url);
        var path = url.pathname.toLowerCase();
        switch (path) {
            case '/chat/sendfilemessage':
                event.respondWith((async () => {
                    return new Response(null, { "status": 400 });
                })())
                break;
            default:
                event.respondWith(caches.match('offline.html'));
        }
    }
});
*/

self.addEventListener('sync', event => {
    if (event.tag === 'process-file-messages') {
        event.waitUntil((async () => {
            let request = self.indexedDB.open('uploads');
            request.onsuccess = function (event) {
                let db = event.target.result;
                let store = db.transaction("uploads", "readonly").objectStore("uploads");
                let keys = store.getAllKeys();
                keys.onsuccess = function () {
                    for (let key of keys.result) {
                        sendFileMessage(key);
                    }
                }
            };
        })());
    }
});

self.addEventListener('push', event => {
    const payload = event.data?.json() ?? {};

    if (payload.count !== undefined) {
        self.navigator.setAppBadge(Number(payload.count))
    }

    if (payload.message !== undefined && payload.url !== undefined) {
        if (payload.title !== undefined) {
            self.registration.showNotification(payload.title, {
                body: payload.message,
                icon: 'icon.png',
                data: { url: payload.url }
            });
        } else {
            self.registration.showNotification('Wallogy', {
                body: payload.message,
                icon: 'icon.png',
                data: { url: payload.url }
            });
        }
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});

function sendFileMessage(key) {
    let request = self.indexedDB.open('uploads');
    request.onsuccess = function (event) {
        let db = event.target.result;
        let store = db.transaction("uploads", "readonly").objectStore("uploads");
        let msg = store.get(key);
        msg.onsuccess = function (event) {
            let files = event.target.result.files;
            let chatChannelId = event.target.result.chatChannelId;
            let data = new FormData();
            for (let file of files) {
                data.append("files", file);
            }
            data.append("id", key);
            data.append("chatChannelId", chatChannelId);
            fetch('/chat/sendfilemessage',
                {
                    method: "POST",
                    body: data
                })
                .then((response) => {
                    if (!response.ok) {
                        response.text().then((error) => {
                            console.log(error);
                        });
                    }
                    cleanupFileMessage(key);
                })
                .catch((error) => {
                    cleanupFileMessage(key);
                });
        }
    };
}

function cleanupFileMessage(key) {
    let request = self.indexedDB.open('uploads');
    request.onsuccess = function (event) {
        let db = event.target.result;
        let store = db.transaction("uploads", "readwrite").objectStore("uploads");
        store.delete(key);
    };
}
