importScripts('https://www.gstatic.com/firebasejs/10.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.2.0/firebase-messaging-compat.js');

async function pushMetric(labels) {
  let { origin, hostname } = self.location;

  if (hostname === 'localhost') {
    origin = 'https://our.dating';
  }

  const apiUrl = `${origin}/api/events`;

  const bodyJSON = JSON.stringify({
    metricType: 'counter',
    eventName: 'web_push_notification',
    labels,
    value: 1,
  });

  console.log('pushMetric', bodyJSON);

  return self.fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyJSON,
    keepalive: true,
  });
}

// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyA1AvRLwizhBjhR2EpA1xDHDfeHxA9_EWw',
  authDomain: 'gdx-push-ef050.firebaseapp.com',
  projectId: 'gdx-push-ef050',
  storageBucket: 'gdx-push-ef050.appspot.com',
  messagingSenderId: '962056622509',
  appId: '1:962056622509:web:d1480f0c9d0c1fad821124',
  measurementId: 'G-75NT8YL4Q9',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message ', payload);

  self.registration.showNotification(payload.data.notification_title, {
    body: payload.data.notification_body,
    icon: './webpush/webpush-icon.png',
    badge: './webpush/webpush-badge.png',
    data: payload.data,
    // tag: payload.data.type,
  });

  return pushMetric({
    action: 'show',
    type: payload.data.type,
  });
});

self.addEventListener('notificationclick', (event) => {
  console.log('SW notification click event', event);
  let path = '/chat/list';
  const { origin } = self.location;
  let utm = '';
  /*
    {
      "type": "like|match|message", - тип пуша
      "premium": true/false, - у юзера активен премиум
      "autologin_hash": "string" - хеш для автологина
    }
  */
  if (event.notification.data) {
    // sendAnalyticsEvent(
    //   `${event.notification.data.type}_click`,
    //   'webpush',
    //   `premium_${event.notification.data.premium}`
    // );

    utm = `?utm_source=webpush&utm_medium=${event.notification.data.type}_click`;

    if (event.notification.data.type === 'like') {
      path = '/activity/incoming';
    }
  }

  const url = new URL(path, origin);

  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      for (let i = 0; i < windowClients.length; i += 1) {
        const windowClient = windowClients[i];
        const windowUrl = new URL(windowClient.url);
        if (windowUrl.origin === url.origin) {
          return windowClient.focus().then(() => {
            if (windowUrl.href !== url.href) {
              return windowClient.navigate(url.href + utm);
            }
          });
        }
      }

      if (event.notification.data) {
        if (event.notification.data.autologin_hash) {
          path = `${origin}/signin/autologin/${
            event.notification.data.autologin_hash
          }/redirect/${encodeURIComponent(origin + path + utm)}`;

          return clients.openWindow(path);
        }
      }

      return clients.openWindow(url.href);
    })
    .then(() => {
      return pushMetric({
        action: 'click',
        type: event.notification.data.type,
      });
    });

  event.notification.close();
  event.waitUntil(promiseChain);
});

self.addEventListener('fetch', () => {
  // @todo: need to add offline due to chrome changes:
  // https://developer.chrome.com/blog/improved-pwa-offline-detection/
});
