self.addEventListener('install', function(event) {
  var offlinePage = new Request('offline.html');
  event.waitUntil(
  fetch(offlinePage).then(function(response) {
    return caches.open('pwabuilder-offline').then(function(cache) {
      return cache.put(offlinePage, response);
    });
  }));
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function(error) {
        return caches.open('pwabuilder-offline').then(function(cache) {
          return cache.match('offline.html');
      });
    }));
});

self.addEventListener('refreshOffline', function(response) {
  return caches.open('pwabuilder-offline').then(function(cache) {
    return cache.put(offlinePage, response);
  });
});

function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s*1000));
}

function formattime(t)
{
  if (t<0) {return "!:!!"}
  var secs=Math.floor(t/1000) % 60;
  return Math.floor(t / 60000)+":"+(secs<10?"0":"")+secs;
}

function dotitle(payload) {
  var CurrTime= new Date();
  var title = "In "+formattime(payload.Pred-CurrTime);
  if (payload.hasOwnProperty('HighPred')) title += " to "+formattime(payload.HighPred-CurrTime);
  title+=" at "+(new Date(payload.Pred)).toLocaleTimeString();
  return title;
}

self.addEventListener('push', function(event) {
  var payload = JSON.parse(event.data.text());
  var body=payload.stop+" on route "+payload.route+"\nVehicle "+payload.fleet;
  if (payload.hasOwnProperty('nearstop')) body+=" "+payload.nearstop;
  var settings = {
      body: body,
      requireInteraction: true,
      tag: payload.tag,
      icon: "/favicon256.png",
      data: payload,
      vibrate: [300, 100, 400]
    };
  event.waitUntil(
    self.registration.showNotification(dotitle(payload), settings).then(async function() {
       delete settings.vibrate;
       settings.silent=true;
       for (var i=0; i<=1; i++) {
         await sleep(10);
         self.registration.getNotifications({tag: payload.tag}).then (function (notlist) {
            if (notlist.length>0) {
               payload=notlist[0].data;
               self.registration.showNotification(dotitle(payload), settings);
            } else i=999;
         });
       }
    })
  );
});

self.addEventListener('notificationclose', function(event) {
   var payload=event.notification.data;
   if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
     event.waitUntil(self.registration.getNotifications({tag: payload.tag}).then (function (notlist) {
        if (notlist.length==0) {
          fetch('/cancelnotestop?id='+payload.tag+'&user='+payload.userid);
        }
     }))
   } else event.waitUntil(fetch('/cancelnotestop?id='+payload.tag+'&user='+payload.userid));
});

self.addEventListener('notificationclick', function(event) {
  var url=decodeURIComponent(event.notification.data.stopurl);
  event.waitUntil(clients.matchAll({type: "window"}
  ).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (decodeURIComponent(client.url).includes(url) && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow('predict?s='+url);
  }));
});

