importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js');
importScripts('https://sorianoticias.com/fb_config.js?r=5');
importScripts('https://sorianoticias.com/fb_func.js?r=5');


//ajaxLog('Service worker init');
//ajaxLog(firebaseConfig);

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();



messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    //ajaxLog('[firebase-messaging-sw.js] Received background message ');
    //ajaxLog(payload);

    //ajaxLog(US);

    var UTM_SOURCE = getUTM_SOURCE();    
    var PUSH_ICON = getPUSH_ICON();
    //ajaxLog(UTM_SOURCE);
    //ajaxLog(US);

    var options = getNotificationOptions(payload, UTM_SOURCE, PUSH_ICON);

    if(options!=false){
        //ajaxLog(options);
        return self.registration.showNotification(options.title, options);
    }else{
        console.log("getNotificationOptions() false");
        //ajaxLog("getNotificationOptions() false");
    }
    /*var  title =payload.data.title;

    var options ={
        body: payload.data.body,
        //icon: payload.data.icon,
        image: payload.data.image,
        data:{
            time: new Date(Date.now()).toString(),
            click_action: payload.data.click_action
        }
        
    };
    return self.registration.showNotification(title, options);*/
});


self.addEventListener("notificationclick", function(event, UTM_SOURCE) {

    console.log("service -notificationclick. ", event);
    //ajaxLog("service -notificationclick. ");
    //ajaxLog(event);
    
    //ajaxLog("service UTM_SOURCE" + UTM_SOURCE);
    //var action_click=event.notification.data.click_action;
    var action_click = ""; //https://sorianoticias.com

    if(event.notification.data.click_action !== ""){
        action_click = event.notification.data.click_action;
    }

    event.notification.close();

    event.waitUntil(
        clients.openWindow(action_click)
    );
    //clients.openWindow(action_click)
});