"use script";
self.addEventListener('install', function(evt) {
    evt.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(evt) {
    console.log("Activated Letreach");
});
function getMainsubid(subscription){
    var endpointURL = 'https://android.googleapis.com/gcm/send/';
    if ('subscriptionId' in subscription) {
        sub = subscription.subscriptionId;
    } else {
        sub = subscription.endpoint;
    }
    if(sub.indexOf(endpointURL) === 0) {
        return subscriptionId = sub.replace(endpointURL , '');
    }
    return sub;
}
self.addEventListener('push', function(evt) {
    evt.waitUntil(
        self.registration.pushManager.getSubscription().then(function(subscription) {
            SubscriberId=getMainsubid(subscription);
            if(evt.data){
                var payload = JSON.parse(evt.data.text());
                console.log(payload);
                var title = payload.title;
                var notificationTag=payload.id;
                var msg = payload.msg;
                var url = payload.url;
                var icon = payload.image + '?main=' + encodeURIComponent(url)+'&';
                console.log("PayloadPush");
                DeliveryAck="https://api.letreach.com/push/trackDelivery/?subid="+encodeURIComponent(payload.subscriptionId)+"&notificationTag="+payload.id+"&hash=d269b871e45d1ef378292efc0773c312";
                fetch(DeliveryAck).catch(function(err) {
                    console.log(err);
                });
                if (payload.actions !== undefined){
                    actions=payload.actions;
                    actionsarr=[];
                    urls=[];
                    actions.forEach(function(item){
                        var temp={action:'action1','title':item.Title};
                        actionsarr.push(temp);
                        urls.push(item.Link);
                    });
                    if(payload.actions.length==1){
                        icon=icon+"&action1="+urls[0];
                    }
                    if(payload.actions.length==2){
                        icon=icon+"&action1="+urls[0]+"&action2="+urls[1];
                    }
                    content = {requireInteraction: payload.requireInteraction,body: msg,icon: icon,tag: notificationTag, actions:actionsarr};
                }else{
                    content = {requireInteraction: payload.requireInteraction,body: msg,icon: icon,tag: notificationTag};
                }
                return  self.registration.showNotification(title, content);
            }else{
                return fetch("https://api.letreach.com/push/getPush/?hash=d269b871e45d1ef378292efc0773c312&subid="+SubscriberId).then(function(response) {
                    return response.json().then(function(json) {                                    
                        console.log("Callback");
                        var msg = json;
                        var title = msg.title;
                        var message = msg.message;
                        var notificationTag = msg.id ;
                        var url=msg.url;
                        var icon = msg.icon+'?main='+encodeURIComponent(msg.url);
                        DeliveryAck="https://api.letreach.com/push/trackDelivery/?subid="+SubscriberId+"&notificationTag="+notificationTag+"&hash=d269b871e45d1ef378292efc0773c312";

                        fetch(DeliveryAck).catch(function(err) {
                            console.log(err);
                        });

                        if (msg.actions !== undefined){
                            if(msg.actions.length==1){
                                icon=icon+"&action1="+msg.url1;
                            }
                            if(msg.actions.length==2){
                                icon=icon+"&action1="+msg.url1+"&action2="+msg.url2;
                            }
                            content = {requireInteraction: msg.requireInteraction,body: message,icon: icon,tag: notificationTag, actions:msg.actions};
                        }else{
                            content = {requireInteraction: msg.requireInteraction,body: message,icon: icon,tag: notificationTag};
                        }                    
                        return self.registration.showNotification(title, content);                                     
                    });
                });
            }
        }).catch(function(err) {
            var title = 'Oops! Something went wrong!';
            var message = 'Sorry, due to some error the notification that was sent couldn\'t be displayed.';
            var icon = 'https://cdn.letreach.com/img/global/noti-error.png?main=' + encodeURIComponent('https://letreach.com/notification-push-error');
            var notificationTag = 'fetch-error';
            if (variable === undefined || variable === null) {
                SubscriberId="NotFound";
            }
            var swlogurl =  'https://api.letreach.com/push/errorlog/?subscriptionId='+SubscriberId +'&error='+err.toString()+'&hash=d269b871e45d1ef378292efc0773c312';
            fetch(swlogurl);
            return self.registration.showNotification(title, {
                body: message,
                icon: icon,
                tag: notificationTag
            });
        }))
});

function getQueryVariable(iconurl,variable) {
    var query = iconurl.split("?")[1];
    if(query.indexOf('&')>-1){
        var vars = query.split("&");
    }else{
        vars=[query];
    }
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    } 
}

self.addEventListener('notificationclick', function(evt) {
    self.registration.pushManager.getSubscription().then(function(subscription){
        var ClickAck =  "https://api.letreach.com/push/trackClick/?subid="+encodeURIComponent(subscription.endpoint)+"&notificationTag="+evt.notification.tag+"&hash=d269b871e45d1ef378292efc0773c312&action="+evt.action;
        evt.notification.close();

        fetch(ClickAck).
        catch(function(err) {
        });
    });
    var icon=evt.notification.icon;    
    if (evt.action === 'action1') {  
        var url=decodeURIComponent(getQueryVariable(icon,"action1"))
    }  
    else if (evt.action === 'action2') {  
        var url=decodeURIComponent(getQueryVariable(icon,"action2"))  
    }  
    else {  
        var url=decodeURIComponent(getQueryVariable(icon,"main"));
    }  
    return clients.openWindow(url);
});
