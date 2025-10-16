// TODO: serve firebase module without CDN
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

const config = JSON.parse(new URL(location).searchParams.get('config'));

firebase.initializeApp(config);

// hack on background notification (https://github.com/firebase/quickstart-js/issues/410#issuecomment-752012772)
class CustomPushEvent extends Event {
    constructor(data) {
        super('push')

        Object.assign(this, data)
        this.custom = true
    }
}
self.addEventListener('push', (e) => {
    // Skip if event is our own custom event
    if (e.custom) return;

    // Kep old event data to override
    let oldData = e.data;

    // Create a new event to dispatch, pull values from notification key and put it in data key,
    // and then remove notification key
    let newEvent = new CustomPushEvent({
        data: {
            json() {
                let newData = oldData.json()
                newData.data = {
                    ...newData.data,
                    ...newData.notification
                }
                delete newData.notification
                return newData
            },
        },
        waitUntil: e.waitUntil.bind(e),
    });

    // Stop event propagation
    e.stopImmediatePropagation();

    // Dispatch the new wrapped event
    dispatchEvent(newEvent);
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
    const { data: { title, body, image, link, type } } = payload;

    self.addEventListener('notificationclick', function (event) {
       if (link) {
           clients.openWindow(link);
       }
       event.notification.close();
    });

    self.registration.showNotification(title, {
        body,
        image,
        icon: image
    });
});
