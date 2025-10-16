importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
//TODO replace here
firebase.initializeApp({
   'messagingSenderId': 'G-9GFSW90DJQ',
   'apiKey': 'AIzaSyCVDKe3VW5zZpctrU0GC3lRt5wjmncUknU',
   'projectId': 'portalgra', 
   'appId': '1:184856146742:web:2a5f0bfddc2f8cba653997',
});
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    var title = "New Article";
	var body = "New Article";
	var icon = "";
	var tagName = "notification-tag";
	var redirect = "";
	
	try{
		if(payload.data){
			tagName = payload.data.articleId ? payload.data.articleId : tagName;
			title = payload.data.ptTitle ? payload.data.ptTitle : title;
			body = payload.data.ptBody ? payload.data.ptBody : body;
			icon = payload.data.ptIcon ? payload.data.ptIcon : icon;
			redirect = payload.data.ptRedirect ? payload.data.ptRedirect : redirect;
			
			if(navigator.language.indexOf("en") != -1){
				title = payload.data.enTitle ? payload.data.enTitle : title;
				body = payload.data.enBody ? payload.data.enBody : body;
				icon = payload.data.enIcon ? payload.data.enIcon : icon;
				redirect = payload.data.enRedirect ? payload.data.enRedirect : redirect;
			}
		}
	}catch(er){ console.error(er); }
	
	const notificationTitle = title;
	const notificationOptions = {
			body: body,
			icon: icon,
			tag: tagName,
            data: {redirect: redirect}
	};
    return self.registration.showNotification(notificationTitle,notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
    if(event.notification && event.notification.data && event.notification.data.redirect)
        return clients.openWindow(event.notification.data.redirect);
});
