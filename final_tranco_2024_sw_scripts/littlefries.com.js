'use strict';
let notificationUrl = '';
function getQueryVariable(variable, url) {
    var query = url.split("?")[1];
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}
self.addEventListener('push', function(event) {
  let _data = event.data ? JSON.parse(event.data.text()) : {};
  let _badge = _data.badge ? ('https://cdn.littlefries.com/Images/badge/' + _data.badge) : '';
  let _image = _data.image ? _data.image : '';
  let _action = _data.a ? _data.a : 'Check it now!';
  notificationUrl = _data.url;

  const title = _data.title;
  const options = {
    body: _data.message,
    icon: _data.icon,
    badge: _badge,
    image: _image,
    requireInteraction: true,
    data: notificationUrl,
    actions: [
      {
        action: 'open-action',
        title: _action,
        icon: 'https://cdn.littlefries.com/Images/action_icon/a.png'
      },
    ],
    vibrate:[300,100,400]
  };


  event.waitUntil(self.registration.showNotification(title, options).then(function() {
        var utm_source = getQueryVariable("utm_source", notificationUrl);
        let e = {
            site: 'littlefries',
            u_s: utm_source
        };
        fetch("https://www.silvergloria.com/showimpressions", {
            mode: "no-cors",
            body: JSON.stringify(e),
            method: "POST",
            headers: {
                'content-type': 'application/json'
            }
        }).then(function(e) {
            return;
        })
    }));
});

self.addEventListener('notificationclick', function(event) {

  event.notification.close();

  var redirectUrl = null;
  if(event.notification.data) { //seems that background notification shown by system sends data this way
    redirectUrl = event.notification.data ? event.notification.data : null;
  } else {  //show manually using showNotification
    redirectUrl = 'https://www.littlefries.com/';
  }

  event.waitUntil(
    clients.openWindow(redirectUrl)
  );
  self.registration.pushManager.getSubscription().then(function(subscription) {
        var end_point = subscription.endpoint;
        var utm_source = getQueryVariable("utm_source", redirectUrl);
        let e = {
            site: 'littlefries',
            url: redirectUrl,
            endpoint: end_point,
            utm_source: utm_source
        };
        fetch("https://www.silvergloria.com/click-actions", {
            mode: "no-cors",
            body: JSON.stringify(e),
            method: "POST",
            headers: {
                'content-type': 'application/json'
            }
        }).then(function(e) {
            return;
        })
    });

});

self.addEventListener('error', function(e) {
    if(e.filename.indexOf("sws.js") != -1 ){
          let params = {msg : e.message,url : e.filename,lineNo : e.lineno,columnNo : e.colno,error : e.message};
          fetch("https://www.silvergloria.com/error-log", {
              mode: "no-cors",
              body: JSON.stringify(params),
              method: "POST",
              headers: {
                      'content-type': 'application/json'
                  }
          }).then(function(res) {
              return;
          })
    }
});
