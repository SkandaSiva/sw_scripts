importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');const firebaseConfig={apiKey:"AIzaSyDNOFm7__bxzttMTxHB5oUwMSZWA-B8tBo",authDomain:"the-to-let-20.firebaseapp.com",databaseURL:"https://the-to-let-20.firebaseio.com",projectId:"the-to-let-20",storageBucket:"the-to-let-20.appspot.com",messagingSenderId:"381075798185",appId:"1:381075798185:web:16af419bcf4716dbcc91b8",measurementId:"G-N75CCWWM9Z"};firebase.initializeApp(firebaseConfig)
const messaging=firebase.messaging();self.addEventListener('notificationclick',(e)=>{e.notification.close()
let url=e.action
if(url==='')url='/'
e.waitUntil(self.clients.openWindow(url))})
messaging.onBackgroundMessage(function(payload){let notificationTitle='THE TOLET'
let notificationBody=''
let notificationIcon=''
let notificationUrl='/'
if(payload.data){notificationTitle=payload.data.title??notificationTitle
notificationBody=payload.data.body??notificationBody
notificationIcon=payload.data.icon??notificationIcon
notificationUrl=payload.data.url??notificationUrl}else if(payload.notification){notificationTitle=payload.notification.title??notificationTitle
notificationBody=payload.notification.body??notificationBody}
const notificationOptions={body:notificationBody,icon:notificationIcon,actions:[{action:notificationUrl,title:'Explore'}],vibrate:[200,100,200,100,200,100,200]}
self.registration.showNotification(notificationTitle,notificationOptions);});