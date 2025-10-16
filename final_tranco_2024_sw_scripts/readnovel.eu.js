const VERSION = "v1.1";

importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-analytics-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyA_wV8b5IxO7BsTGUE1H-eMv-cwOIbs32E",
  authDomain: "core-almanac-327114.firebaseapp.com",
  projectId: "core-almanac-327114",
  storageBucket: "core-almanac-327114.appspot.com",
  messagingSenderId: "778632375770",
  appId: "1:778632375770:web:b0bee62a5f12c9d9c264e3",
  measurementId: "G-L4CD0WMXGS",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
let analytics = null;
try {
  analytics = firebase.analytics();
} catch (e) {
  console.log(e);
}

messaging.onBackgroundMessage((payload) => {
  const { data } = payload;
  const notificationTitle = data.title;

  const notificationOptions = {
    body: data.body,
    image: data.image,
    data: {
      click_action: data.click_action,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
self.addEventListener("fetch", (event) => {
  // Check if request url contains 'getchapter', if it does perform normal fetch
  if (
    event.request.url.includes("getchapter") ||
    event.request.url.includes("/chapter/")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (navigator.onLine) {
    // If online, always fetch resource from network and update cache
    event.respondWith(
      fetch(event.request).then((res) =>
        caches.open(VERSION).then((cache) => {
          cache.put(event.request.url, res.clone());
          return res;
        })
      )
    );
  } else {
    // If offline, try to get resource from cache
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Cached response found, return it
          return cachedResponse;
        }
        // No cached response, depending on your app, you might want to return a fallback page
      })
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => Promise.all(keyList?.map((key) => caches.delete(key))))
  );
  return self.clients.claim();
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (analytics) {
    analytics.logEvent("notification_click", {
      notification_title: event.notification.title,
      notification_body: event.notification.body,
    });
  }
  const url = `${event.notification.data.click_action}`;

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
