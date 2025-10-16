
        
var link;
var data;

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    return self.clients.claim();
});

self.addEventListener('push', function (event) {
    data = JSON.parse(event.data.text());
    link = data.link;
    var title = data.title;
    var options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        image: data.image
    };

    let dataRequest = new Request(data.site + '/cdn/data/' + data.type + '/' + data.id);
    fetch(dataRequest, {
        method: 'get',
    })

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    let imageRequest = new Request(data.site + '/cdn/images/' + data.type + '/' + data.id);
    fetch(imageRequest, {
        method: 'get',
    })

    event.waitUntil(
        clients.openWindow(event.target.data.link)
    );
});
            