importScripts("https://cdn.howto-news.info/firebase-app-compat.min.js");
importScripts("https://cdn.howto-news.info/firebase-messaging-compat.min.js");
const firebaseConfig = {
	  apiKey: "AIzaSyCUmahQTJtDOSnW2x6K4RKsTdWbRy0b3kc",
	  authDomain: "howtonews-1779a.firebaseapp.com",
	  databaseURL: "https://howtonews-1779a.firebaseio.com",
	  projectId: "howtonews-1779a",
	  storageBucket: "howtonews-1779a.appspot.com",
	  messagingSenderId: "842475724750",
	  appId: "1:842475724750:web:701d3d6a6c2b9768c1d59f"
	};
	firebase.initializeApp(firebaseConfig);
	const messaging = firebase.messaging();

messaging.onBackgroundMessage((res) => {
    let o = res.data;
    o.data = res.data;
    o.requireInteraction = true;
    return self.registration.showNotification(o.title, o);
});	
self.addEventListener('notificationclick', function (e) {
    e.notification.close();
    var url = e.notification.data.url;
    e.waitUntil(clients.openWindow(url));
});
const OFFLINE_VERSION=3,CACHE_NAME="offline",OFFLINE_URL="/offline.html";self.addEventListener("install",t=>{t.waitUntil((async()=>{let t=await caches.open(CACHE_NAME);await t.add(new Request(OFFLINE_URL,{cache:"reload"}))})()),self.skipWaiting()}),self.addEventListener("activate",t=>{t.waitUntil((async()=>{self.registration.navigationPreload&&await self.registration.navigationPreload.enable()})()),self.clients.claim()}),self.addEventListener("fetch",t=>{"navigate"===t.request.mode&&t.respondWith((async()=>{try{let a=await t.preloadResponse;if(a)return a;let e=await fetch(t.request);return e}catch(i){console.log("sw fetch error ",i);let n=await caches.open(CACHE_NAME),r=await n.match(OFFLINE_URL);return r}})())});