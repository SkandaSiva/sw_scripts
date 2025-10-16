self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    var data = {};
    if (event.data) {
        data = event.data.json();
    }

    console.log('Notification Received:');
    console.log(data);

    var isMobile = IsMobile();

    var title = data.title;
    var message = data.message;
    var icon = data.icon;
    var image = data.image;
    var dataUrl = data.url;

    var urlObj = new URL(dataUrl);

    // add tracking querystrings
    urlObj.searchParams.set('utm_medium', 'Push');
    urlObj.searchParams.set('utm_campaign', 'Blog');

    if (isMobile) {
        urlObj.searchParams.set('utm_source', 'Mobile');
    }
    else {
        urlObj.searchParams.set('utm_source', 'Desktop');
    }

    var notificationData = {
        url: urlObj.toString()
    };
    var notificationOptions = {
        body: message,
        icon: icon,
        badge: icon,
        image: image,
        data: notificationData
    };

    event.waitUntil(self.registration.showNotification(title, notificationOptions));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    var notificationData = event.notification.data;

    var notificationUrl = notificationData['url'];
    var promiseChain = clients.openWindow(notificationUrl);
    event.waitUntil(promiseChain);
});

self.addEventListener('install', (event) => {
    //console.log('👷', 'install', event);
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    //console.log('👷', 'activate', event);
    return self.clients.claim();
});

function IsMobile () {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    }

    return false;
}