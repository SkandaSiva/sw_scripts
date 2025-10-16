importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.0.0/firebase-app-compat.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.0.0/firebase-messaging-compat.min.js");
importScripts("service-worker.js");


firebase.initializeApp({
    apiKey: "AIzaSyCZ9zGDO5t1GWvK3suv7xNmW99bQxysoHE",
    authDomain: "secretfriends-0.firebaseapp.com",
    databaseURL: "https://secretfriends-0.firebaseio.com",
    projectId: "secretfriends-0",
    storageBucket: "secretfriends-0.appspot.com",
    messagingSenderId: "676666821055",
    appId: "1:676666821055:web:086f9e895c2c63e67eb90a",
    measurementId: "G-7BPX093HG6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const { title, link_url,click_action,body,image,icon, ...options } = payload.data;

    const notificationOptions = {
        body: body,
        icon: icon,
        title: title,
        click_action: click_action,
        link_url: click_action,
        image: image,
        data: {
            link_url : click_action,
            body: body,
            icon: icon,
            title: title,
            click_action: click_action,
            image: image,
        }
    };

    const channel4Broadcast = new BroadcastChannel('broadcast-message');
    channel4Broadcast.postMessage({key: notificationOptions});

    return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.matchAll({ type: "window" }).then((clientList) => {
        for (const client of clientList) {
            if (client.url === "/" && "focus" in client) return client.focus();
        }
        if (clients.openWindow && Boolean(event.notification.data.link_url)) {

            const channel = new BroadcastChannel("broadcast-message");
            channel.postMessage({key: event.notification.data});
            if (typeof localStorage !== 'undefined')
            {
                const channelBroadcast = new BroadcastChannel("broadcast-message");
                channelBroadcast.addEventListener("message", (event) => {
                    let payload = event.data.key;
                    if(!localStorage.getItem("broadcast-message"))
                    {
                        localStorage.setItem("broadcast-message", JSON.stringify(event.data.key));
                    }
                })
            }

            return clients.openWindow(event.notification.data.link_url);
        }

    }).catch(err => {
        console.log("There was an error waitUntil:", err);
    }));
});


