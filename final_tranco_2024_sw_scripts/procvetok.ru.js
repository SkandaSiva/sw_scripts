var link=''
var notification=null
var showNotification=function(data,options){
  return new Promise(function(resolve,reject){
      self.registration.showNotification(data.title, options).then(function(res){
        fetch('/push_service/?a=delivered&secret='+data.secret).then(function(res){
          resolve()
        })
        
      })
  })
  
}

self.addEventListener('install', function(event) {
  //console.log('pushworker.js install')
});

self.addEventListener('push', ev => {
  const data = ev.data.json()

  var isMacOpera = !!navigator.userAgent.match(/.*Macintosh;.* OPR\/[\d\.]+$/i)
  var requireInteraction=!isMacOpera

  var options = {
    body: data.body,
    //icon: 'http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png'
    icon: data.icon,
    image: data.image,
    //badge: data.image,
    actions: data.actions,
    data:data,
    requireInteraction: requireInteraction
    /*"badge": "<URL String>",
    "vibrate": "<Array of Integers>",
    "sound": "<URL String>",
    "dir": "<String of 'auto' | 'ltr' | 'rtl'>",
  
    "//": "Behavioural Options",
    "tag": "<String>",
    "data": "<Anything>",
    "requireInteraction": "<boolean>",
    "renotify": "<Boolean>",
    "silent": "<Boolean>",
  
    "//": "Both Visual & Behavioural Options",
    "actions": "<Array of Strings>",
  
    "//": "Information Option. No visual affect.",
    "timestamp": "<Long>"*/
  }
  var utcTime=Date.now()
  if(data.timeEnd*1000>utcTime){
      ev.waitUntil(showNotification(data,options))
  }

})


self.addEventListener('notificationclick', function(event) {
  /*console.log('event.notification.data',event.notification.data)
  */
  
  const data = event.notification.data
 
  const target = !!event.action?event.action:(event.notification.data.link||'/');
  event.notification.close()
  
  event.waitUntil(clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == target && 'focus' in client) {
                return client.focus()
            }
        }
        return clients.openWindow(target)
    }).then(function(e){
      return fetch('/push_service/?a=clicked&secret='+data.secret)
    })
  );
});
/*
{
  "//": "Visual Options",
  "body": "<String>",
  "icon": "<URL String>",
  "
}
*/
