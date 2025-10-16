var deferredPrompt;

self.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    //console.log('Perform install steps')
    deferredPrompt = e;
});

self.addEventListener('install', function(event) {
    console.log('Perform install steps')
});

self.addEventListener('fetch', function(e)  {
    return ;
});

self.addEventListener('notificationclick', function(event) {

    const clickedNotification = event.notification;
    const notificationData = clickedNotification.data;
    const homePage = '/';

    if (!event.action) {

        event.waitUntil(clients.openWindow(notificationData['defaultUrl']));

    } else {
        switch (event.action) {
            case 'read-more-action':
                event.waitUntil(clients.openWindow(notificationData['url1']));
                break;
            case 'other-action':
                console.log('clicked the other action');
                event.waitUntil(clients.openWindow(notificationData['url2']));
                break;
        }
    }

    clickedNotification.close();

});

self.addEventListener('push', function(event) {

    if(!event.data) return;
    var data = event.data.json(),
        title = data.title;

    delete data.title;

    const promiseChain = self.registration.showNotification(title, data);

});
