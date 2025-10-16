importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

firebase.initializeApp({
    apiKey: "AIzaSyA7zSFJv0HpF-aEMnEjjfAIBol3m17FAfM",
    authDomain: "englishcentral-com-api-project-108821948315.firebaseapp.com",
    databaseURL: "https://englishcentral-com-api-project-108821948315.firebaseio.com",
    projectId: "englishcentral.com:api-project-108821948315",
    storageBucket: "undefined",
    messagingSenderId: "108821948315",
    appId: "1:108821948315:web:5513c29505f75e2b1aa33e"
});

const INSTANA_EVENT_PUSHNOTIFICATION = "PushNotification";
const EVENT_RECEIVED = 14;
const EVENT_OPEN = 15;
const EVENT_IGNORE = 16;
const EVENT_FAILED = 19;
const APPSTATELAUNCHED_ACTIVE = "Active";
const APPSTATELAUNCHED_BACKGROUND = "Background";
const ECDOMAIN = "https://www.englishcentral.com";

async function postData(url = "", data = {}, responseText = false) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        if (responseText) {
            return response.text();
        }
        return response.ok;
    } catch(e) {
        console.log("postData", e);
    }
}

function sendPostofficeEvent(eventTypeId, rawParams) {
    if (!rawParams) {
        console.log("missing params");
        return;
    }
    rawParams.eventTypeID = eventTypeId;
    rawParams.campaignHistoryID = rawParams.campaignHistoryID ? rawParams.campaignHistoryID : null;
    postData(ECDOMAIN + '/api/postofficeevent', rawParams);
}

async function sendInstanaEvent(eventTypeId, tracking, supplemental, applicationStateLaunched = APPSTATELAUNCHED_ACTIVE) {
    const MESSAGE_KEY_INSTRUMENTATION = "Instrumentation";
    if (!tracking) {
        console.log("missing tracking");
        return;
    }
    let instanaParams = {
        ...tracking,
        eventTypeID: eventTypeId,
        sessionID: supplemental.sessionId,
        tutorAccountID: supplemental.tutorAccountId,
        campaignHistoryID: tracking.campaignHistoryID,
        applicationStateLaunched: applicationStateLaunched
    }

    const clients = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
    clients[0]?.postMessage({
        messageKey: MESSAGE_KEY_INSTRUMENTATION,
        eventName: INSTANA_EVENT_PUSHNOTIFICATION,
        eventParams: instanaParams
    });
}

function sendNotification(alert, meta, tracking, supplemental, from) {
    if (!alert) {
        return;
    }

    try {
        sendPostofficeEvent(EVENT_RECEIVED, tracking);
        sendInstanaEvent(EVENT_RECEIVED, tracking, supplemental, from);
    } catch(e) {
        console.log("error in sending postoffice event", e);
    }

    const url = meta.url ? meta.url : ECDOMAIN;
    const launchTwa = meta.launchTwa ? "?launchTwa=true" : "";
    const notificationTitle = alert.title;
    const notificationOptions = {
        body: alert.body,
        icon: '/favicon.png',
        data: {
            url: url + launchTwa,
            tracking: tracking,
            applicationStateLaunched: APPSTATELAUNCHED_BACKGROUND
        }
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
}

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
    const alert = JSON.parse(payload.data.alert);

    var meta = {};
    if (payload.data.meta) {
        meta = JSON.parse(payload.data.meta);
    }

    meta.launchTwa = false;
    if (payload.data.launchTwa) {
        meta.launchTwa = true;
    }

    var tracking = {};
    if (payload.data.tracking) {
        tracking = JSON.parse(payload.data.tracking);
    }
    var supplemental = JSON.parse(payload.data.supplemental);
    try {
        sendNotification(alert, meta, tracking, supplemental, APPSTATELAUNCHED_BACKGROUND);
    } catch(e) {
        sendInstanaEvent(EVENT_FAILED, tracking, supplemental, APPSTATELAUNCHED_BACKGROUND);
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const notification = event.notification.data;

    try {
        sendPostofficeEvent(EVENT_OPEN, notification.tracking);
        sendInstanaEvent(EVENT_OPEN, notification.tracking, notification.supplemental, notification.applicationStateLaunched);
    } catch(e) {
        console.log("error in sending events", e);
    }

    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
            .then(function() {
                return clients.openWindow(notification.url || ECDOMAIN);
            })
    );
});

self.addEventListener('notificationclose', function(event) {
    const notification = event.notification.data;
    const notificationPromise = new Promise((resolve, reject) => {
        try {
            sendPostofficeEvent(EVENT_IGNORE, notification.tracking);
            sendInstanaEvent(EVENT_IGNORE, notification.tracking, notification.supplemental, notification.applicationStateLaunched);
        } catch(e) {
            console.log("error in sending event", e);
        }
        resolve(true);
    });
    event.waitUntil(notificationPromise);
});

workbox.routing.registerRoute(
    ({ request }) => request.mode === "navigate",
    new workbox.strategies.NetworkFirst({
        cacheName: "pages",
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 10 * 60 // 10 minutes
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [200],
            }),
        ]
    })
);

workbox.routing.registerRoute(
    ({ request }) =>
        request.destination === "style" ||
        request.destination === "script" ||
        request.destination === "worker",
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: "assets",
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 10 * 60 // 10 minutes
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [200],
            }),
        ]
    })
);

workbox.routing.registerRoute(
    ({ request }) =>
        request.destination === "image",
    new workbox.strategies.CacheFirst({
        cacheName: "images",
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 10 * 60 // 10 minutes
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [200],
            }),
        ]
    })
);
