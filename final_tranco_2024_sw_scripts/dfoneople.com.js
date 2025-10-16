importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js');

const baseUrl = 'https://browser-noti.dfoneople.com';

const registration = self.registration;
const firebaseOption = {
    "apiKey": "AIzaSyCbITsVMcJLtlaAeWYEh9SicLgGufSu6ws",
    "authDomain": "gldf-browser-notification-live.firebaseapp.com",
    "projectId": "gldf-browser-notification-live",
    "storageBucket": "gldf-browser-notification-live.appspot.com",
    "messagingSenderId": "833421392861",
    "appId": "1:833421392861:web:e8785097349f1639d5d434",
    "vapidKey": "BGGQAVid-tXLQvYBINRJQptPSwbKHK1wE98G_xIbj0sO4sXRH4OBWt1pdIYDfUSIWu_WhqonHU2VdWpWRdeoGuA"
}

console.log("Service Worker ON.", firebaseOption);

// Initialize Firebase
firebase.initializeApp(firebaseOption);
const messaging = firebase.messaging();

// 서버 통신 Function
const ajax = async ({ url, method, headers, body }) => {
    const fetchOption = {
        method: method?.toLowerCase() || 'get',
        headers: {
            "Content-Type": "application/json",
            ...headers
        }
    };

    if (fetchOption.method !== 'get') {
        fetchOption.body = JSON.stringify(body);
    }

    const res = await fetch(url, fetchOption);
    const result = await res.text();
    if (result) {
        return JSON.parse(result);
    }
    return true;
}

// 이벤트
// 클릭 시 이벤트
self.addEventListener("notificationclick", async (event) => {
    console.log("Click!!");
    event.notification.close();
    clients.openWindow(event.notification?.data?.url || '/');
    const currentToken = await messaging.getToken({
        vapidKey: firebaseOption.vapidKey,
        serviceWorkerRegistration: registration
    });

    return await ajax({
        method: 'put',
        url: baseUrl + '/fcm/state',
        body: {
            logState: 1,
            fcmToken: currentToken,
            messageIdx: event.notification?.data?.midx || '0'
        }
    });

});

// 닫기 시 이벤트
self.addEventListener("notificationclose", async (event) => {
    console.log("Close...!!");
    const currentToken = await messaging.getToken({
        vapidKey: firebaseOption.vapidKey,
        serviceWorkerRegistration: registration
    });

    await ajax({
        method: 'put',
        url: baseUrl + '/fcm/state',
        body: {
            logState: 2,
            fcmToken: currentToken,
            messageIdx: event.notification?.data?.midx || '0'
        }
    });
    return event.notification.close();
});

let midx = -1;
// 메시지 받을 시 이벤트
messaging.onBackgroundMessage(async (payload) => {
    console.log('[sw.js] Received background message ', payload, JSON.stringify(payload));

    if (!payload || payload.data?.midx === midx) {
        return false;
    }
    midx = payload.data?.midx;

    const currentToken = await messaging.getToken({
        vapidKey: firebaseOption.vapidKey,
        serviceWorkerRegistration: registration
    });

    await ajax({
        method: 'post',
        url: baseUrl + '/fcm/state',
        body: {
            logState: 0,
            fcmToken: currentToken,
            messageIdx: payload.data?.midx || '0'
        }
    });

    // Customize notification here
    const notificationTitle = payload.data?.title;
    const notificationOptions = {
        body: payload.data?.body,
        tag: 'gldf',
        // requireInteraction: true,
        data: {
            url: payload.data?.url || '/',
            midx: payload.data?.midx || 0
        }
    };

    if (payload.data?.icon) {
        notificationOptions.icon = payload.data.icon;
    }

    if (payload.data?.image) {
        notificationOptions.image = payload.data.image;
    }

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 수신 시 이벤트
self.addEventListener("push", async (event) => {
    console.warn('[PUSH] service-worker.js >>> : ', JSON.stringify(event));
});