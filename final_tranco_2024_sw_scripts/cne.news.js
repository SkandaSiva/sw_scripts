/* eslint-disable */
/*
* IMPORTANT!
* 1) When developing on IOS, go to settings, and set notifications ON for browsers, they are disabled by default
* 2) When there is "notification": { "title": "Push Title", "body": "Push body text"} directly in the payload body, the background handler is not fired
*     The background handler does not fire for notifications
* 3) Service workers needs to be unregistered or reloaded to have new changes active
* 4) The notification click listener needs te be before the IMPORTSCRIPT includes, if not they won't work
* 5) You have to subscribe to a topic to get messages which are not directly send to an ID
*
* 6) See postman for FCM triggers to an unique ID
* 7) separate web listener "breaking_web" to prevent listening to app notification which are not suitable.
* 8) usePublicVapidKey is needed to register SW
* https://stackoverflow.com/questions/37711082/how-to-handle-notification-when-app-in-background-in-firebase
* https://liferay.dev/en/b/part-2-web-push-notification
*
* */

self.addEventListener('notificationclick', function (event) {
  event.notification.close() // needed for android
  const url = event.notification.data.url || ''
  if (!url) {
    return
  }
  // This looks to see if the current tab is already open and focuses if it is

  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function (clientList) {
    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i]
      if (client.url == url && 'focus' in client) { return client.focus() }
    }
    if (clients.openWindow) { return clients.openWindow(url) }
  }))
})

importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js')

// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.

importScripts('https://www.gstatic.com/firebasejs/7.16.1/firebase-analytics.js')

const firebaseConfig = {
  apiKey: "AIzaSyBypvXnDLTWih6sYjnNedNJ1eraD7ZGLzY",
  authDomain: "cne-news-3d860.firebaseapp.com",
  projectId: "cne-news-3d860",
  storageBucket: "cne-news-3d860.appspot.com",
  messagingSenderId: "780532005675",
  appId: "1:780532005675:web:0195301f65cb5230ada36e",
  measurementId: "G-QL6XFXR673"
}

firebase.initializeApp(firebaseConfig)

// Retrieve an instance of Firebase Messaging so that it can handle background messages

if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging()
  messaging.usePublicVapidKey('BL4HPr5dk2QwLtE1gQFOl9LrYov-DhXtKJr9vyZAEb1j9e6lnUq6zCWHgbPA5PJ0hTxusFPBp2kx8Ysu075eGjU')
  messaging.setBackgroundMessageHandler(function (payload) {
    const data = payload.data
    const notificationOptions = {
      body: data.body,
      icon: 'https://cne-frontend.dev.deploy.nl/icon-152x152.png',
      badge: 'https://cne-frontend.dev.deploy.nl/push-badge-96x96.png',
      image: data.image,
      requireInteraction: true,
      data: { url: data.url },
      actions: [{ action: 'open_url', title: data.title }],
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    }

    return self.registration.showNotification(
      data.title,
      notificationOptions
    )
  })
}
