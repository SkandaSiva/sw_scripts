var getWindowClientByUrl = function(url){
	return new Promise(function(resolve) {
 	    self.clients.matchAll({includeUncontrolled: true , type: 'window'}).then(function(clientList){
			var found = false;
		    for (let i = 0; i < clientList.length; i++) {
				const parsedClientUrl = new URL(clientList[i].url, self.location.href)
			    if(parsedClientUrl == url){
					found = true;
					resolve(clientList[i]);
					break;
			    }
		    }
			if(!found){
				resolve(undefined);
			}
 	    }); 
	});
}

var myPushnotificationMessages = [];

// ブラウザからのメッセージを処理する
self.addEventListener('message', function(event){
	if(event.data.command == 'myPushnotification'){
		// まだ一度も送信してない場合送信する
		if(event.data.unique_key == null || myPushnotificationMessages.indexOf(event.data.unique_key) == -1){
			if(event.data.unique_key != null){ // unique_keyがある場合、最大１０個までを送信済みリストを追加する 
				myPushnotificationMessages = [event.data.unique_key].concat(myPushnotificationMessages).slice(0,10);
			}
			var randomTime = Math.floor((Math.random() * 20) ,1) * 100;
			setTimeout(function () {
				self.registration.showNotification(event.data.title,{
					body: event.data.body,
					icon: event.data.icon,
					data: event.data.data
				})
			}, randomTime);
		}
	}
});

// FCMより先にバインドしないと、FCMデフォルトのイベントが優先されてしまう
self.addEventListener('notificationclick',function(event){
	// FCMデフォルトのnotificationclickが動かないよう止める
    event.stopImmediatePropagation();

    var click_action = '';
    if(typeof event.notification.data.FCM_MSG !== "undefined"){
        click_action = event.notification.data.FCM_MSG.data.click_action;
    }else{
        click_action = event.notification.data.click_action;
    }

	event.notification.close();
	event.waitUntil(getWindowClientByUrl(click_action).then(function(WindowClient){
		
		if(typeof WindowClient !== 'undefined'){
			return WindowClient.focus();
		}else{
			return self.clients.openWindow(click_action);
		}
	}));
	
});



self.addEventListener('install', function(event) {
    // install イベント終了後、コントロールされているページの有無に関わらず、すぐに activate イベントが発火する
    event.waitUntil(skipWaiting());
});

importScripts('https://www.gstatic.com/firebasejs/9.9.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.9.4/firebase-messaging-compat.js');
const app = firebase.initializeApp({"apiKey":"AIzaSyCPz0VJKN8q216K6NTEQr8LwO0WeSpNw_8","authDomain":"pando-202310.firebaseapp.com","databaseURL":"https:\/\/pando-202310.firebaseio.com","projectId":"pando-202310","storageBucket":"pando-202310.appspot.com","messagingSenderId":"4772246794","appId":"1:4772246794:web:a2875e5509477d296df6f3","measurementId":""});

const messaging = firebase.messaging(app);



