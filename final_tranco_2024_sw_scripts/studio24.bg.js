self.addEventListener("notificationclick", function (event) {
    console.log("[sw.js] On notification click: ", event);
    registration.getNotifications().then(function (notifications) {
        notifications.forEach(function (not) {
            not.close();
        });
    });
    const notificationData =
            event.notification.data.FCM_MSG || event.notification.data;
    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
            self.clients
            .matchAll({
                type: "window",
            })
            .then(function (clientList) {
                const url = notificationData?.click_action ?
                        notificationData?.click_action :
                        notificationData?.data?.click_action ?
                        notificationData?.data?.click_action :
                        event.data?.click_action;
                if (url) {
                    console.log("[sw.js] notification clicked with url:" + url);
                    self.clients.openWindow(url).then(function (wnd) {
                        wnd.focus();
                    });
                }
            })
            );
});

importScripts(
        "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
        );
importScripts(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
        );
importScripts(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
        );
importScripts(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js"
        );
importScripts("https://push-static.dbankcdn.com/hms-messaging.js");

const manifest = [{"revision":"83ed6664db0af8e4f2e159049b0f00a7","url":"app/advertising_agency.json"},{"revision":"152a54a1b9ddb4433a7eb5cd19726190","url":"app/general_terms.html"},{"revision":"4bb3fbd800ad4556142fc046e9ef5b73","url":"app/video_tips.json"},{"revision":"461e544c9deae1b8a70a75a75b317a49","url":"googlefc5b071b9b268e69.html"},{"revision":"42157d2e74c76edaa5ccd2a33efde879","url":"offline.html"}];
if (workbox instanceof Object) {
    const {strategies, routing, precaching, core} = workbox;
    core.setCacheNameDetails({prefix: "stagingCache"});
    core.clientsClaim();
    self.skipWaiting();
    precaching.cleanupOutdatedCaches();
//    precaching.precacheAndRoute(manifest);
}

let messaging = null;

if (firebase instanceof Object) {
    const firebaseConfig = {
        apiKey: "AIzaSyBxp1lwPMe3yOu3ZoggAPt4E0gcAPygRvc",
        authDomain: "studio-218914.firebaseapp.com",
        databaseURL: "https://studio-218914.firebaseio.com",
        projectId: "studio-218914",
        storageBucket: "studio-218914.appspot.com",
        messagingSenderId: "1038447615031",
        appId: "1:1038447615031:web:f98bc94d10db9a1cf133b2"
    };
    let firebaseApp = firebase.initializeApp(firebaseConfig);
    if (typeof firebaseApp !== "undefined") {
        messaging = firebase.messaging();
        console.log("[sw.js] Initialized Firebase messaging");
    }
}
if (!messaging && hms instanceof Object) {
    var hmsConfig = {
        "apiKey": "9rTFIvAEdR-eS4tQnLjoVM_QvfmdNk3IcvCztxQ5",
        "projectId": "736430079244812748",
        "appId": "322385623853819592",
        "countryCode": "DE"
    };
    let huaweiApp = hms.initializeApp(hmsConfig);
    if (typeof huaweiApp !== "undefined") {
        messaging = hms.messaging();
        console.log("[sw.js] Initialized Huawei messaging");
    }
}
if (messaging instanceof Object) {
    if (firebase instanceof Object) {
        messaging.onBackgroundMessage(async function (payload) {
            if (payload instanceof Object) {
                console.log("[sw.js] Received background push ", payload);
                const notificationTitle = payload.data.title;
                const notificationOptions = {
                    body: payload.data.body,
                    icon: payload.data.icon,
                    data: payload.data,
                    click_action: payload.data?.click_action,
                };
                if (payload.notification === undefined) {
                    self.registration.showNotification(
                            notificationTitle,
                            notificationOptions
                            );
                }
                if (payload.data && payload.data.notification_id) {
                    fetch("/showNotification", {
                        method: "post",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({
                            notification_id: payload.data.notification_id,
                        }),
                        credentials: "include",
                    });
                }
            }
        });
    } else {
        self.addEventListener("push", function (event) {
            const payload =
                    event.data instanceof PushMessageData ? event.data.json() : event.data;
            console.log("[sw.js] Received push ", payload);
            if (payload instanceof Object) {
                const notificationTitle = payload.data.title;
                const notificationOptions = {
                    body: payload.data.body,
                    icon: payload.data.icon,
                    data: payload.data,
                    click_action: payload.data?.click_action,
                };
                if (payload.notification === undefined) {
                    self.registration.showNotification(
                            notificationTitle,
                            notificationOptions
                            );
                }
                if (payload.data && payload.data.notification_id) {
                    fetch("/showNotification", {
                        method: "post",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({
                            notification_id: payload.data.notification_id,
                        }),
                        credentials: "include",
                    });
                }
            }
        });
    }
}
