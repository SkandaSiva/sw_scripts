// firebase sample code snippets from https://firebase.google.com/docs/cloud-messaging/js/client
// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js')

// Set Firebase configuration, once available
// get from url
self.addEventListener('fetch', () => {
  const urlParams     = new URLSearchParams(location.search)
  self.firebaseConfig = Object.fromEntries(urlParams)
})

const defaultConfig = {
  apiKey            : true,
  projectId         : true,
  messagingSenderId : true,
  appId             : true
}
// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp(self.firebaseConfig || defaultConfig)

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging()
  // [END initialize_firebase_in_sw]
  messaging.setBackgroundMessageHandler((payload) => {
    const notificationTitle = payload.data.twi_body
    if (payload.data.twi_message_type === 'twilio.conversations.new_message') {
      const notificationOptions = {
        body : payload.data.body,
        icon : 'https://tinkerlust.s3-ap-southeast-1.amazonaws.com/tinkerlust.ico',
        data : { url: `account/conversations/${payload.data.conversation_sid}` }
      }
      return self.registration.showNotification(notificationTitle,
        notificationOptions)
    }
  })
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ includeUncontrolled: false }).then( (windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i]
        // If so, just focus it.
        if (client.url.includes(event.notification.data.url) && 'focus' in client) {
          return client.focus()
        }
      }
      return clients.openWindow(event.notification.data.url)
    })
  )
}, false)