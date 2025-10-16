// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js")

// Set Firebase configuration, once available
self.addEventListener("fetch", () => {
	const urlParams = new URLSearchParams(location.search)
	self.firebaseConfig = Object.fromEntries(urlParams)
})

// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
	apiKey: true,
	projectId: true,
	messagingSenderId: true,
	appId: true
}
console.log("self.firebaseConfig:", self.firebaseConfig)
// Initialize Firebase app
firebase.initializeApp(self.firebaseConfig || defaultConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null
console.log("SW CONNECTED", messaging)

messaging.onBackgroundMessage(function (payload) {
	console.log("Received background messagee: ", payload)

	const notificationTitle = payload.notification.title
	const notificationOptions = {
		body: payload.notification.body.replace(/(<([^>]+)>)/gi, "")
	}

	self.registration.showNotification(notificationTitle, notificationOptions)
})
