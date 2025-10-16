self.addEventListener('push', function(event) {
  //console.log('[Service Worker] Push Received.');
  var payload = event.data ? event.data.text() : '{"titel":"ISB","bericht":"ISB"}';

  var message = JSON.parse(payload);
  
  var title = message.titel;
  var options = {
    body: message.bericht,
    icon: message.icon,
    //badge: 'images/badge.png',
    //vibrate: [500, 100, 500, 100, 500], 
    requireInteraction: true,
    tag: message.tag,
    data: { id:message.id , link:message.link , update:message.update }
  };

//  event.waitUntil(self.registration.showNotification(title, options));

  //filteren op lijst van notificaties met zelfde tag
  //indien meerdere notificaties, nemen we ze samen en zetten een extra teller
  var notificationFilter = { tag: message.tag };
  return self.registration.getNotifications(notificationFilter)
    .then(function(notifications) {
      if (notifications && notifications.length > 0) {
        // Start with one to account for the new notification we are adding
        var notificationCount = 1;
        for (var i = 0; i < notifications.length; i++) {
          var existingNotification = notifications[i];
          if (existingNotification.data && existingNotification.data.notificationCount) {
            notificationCount += existingNotification.data.notificationCount;
          } else {
            notificationCount++;
          }
          //
          title = '(' + notificationCount + ') ' + title;
          options.data.notificationCount = notificationCount;
          //
          existingNotification.close();
        }
      }

      return self.registration.showNotification(title, options);
    });
    
});

self.addEventListener('notificationclick', function(event) {
  //console.log('[Service Worker] Notification click Received.'); 
  //update van message
  hurl = event.notification.data.update;
  if (hurl) {
    hurl = hurl+'&paction=CLICKED';
    fetch(hurl).then(function(response) {
      // success
    }).catch(function(err) {
      // error
    });
  }
      
  event.notification.close();

  //Focus tab if open
  event.waitUntil(clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function (clientList) {
    //console.log("clients:" + clientList.length);
    var hfocus;
    for (var i = 0; i < clientList.length; ++i) {
      var client = clientList[i];
      //console.log("client:" + client.url);
      if (client.url.indexOf(event.notification.data.link) != -1) {
        //console.log("focus:" + client.url);
        hfocus = client;
      }
    }
    if (hfocus) {
      return hfocus.focus();
    }
    if (clients.openWindow) {
      return clients.openWindow(event.notification.data.link);
    }
  }));

});
    
self.addEventListener('notificationclose', function(event) {
  //console.log('[Service Worker] Notification close Received.'); 
  hurl = event.notification.data.update;
  if (hurl) {
    hurl = hurl+'&paction=CLOSED';
    fetch(hurl).then(function(response) {
      // success
    }).catch(function(err) {
      // error
    });
  }
  
});

//fetch event (leeg momenteel) is nodig voor de "Add to desktop" melding
self.addEventListener('fetch', function(event) {

  event.respondWith(
    fetch(event.request).then(function(response) {

      //console.log('event request: ' + event.request.url);
      //console.log('response status: ' + response.status);

      if (!response.ok) {
        // An HTTP error response code (40x, 50x) won't cause the fetch() promise to reject.
        // We need to explicitly throw an exception to trigger the catch() clause.
        //console.log('nok');
      }

      // If we got back a non-error HTTP response, return it to the page.
      return response;
    })
  )
  
});

/*
//fetch event
self.addEventListener('fetch', function(event) {

  var ht0 = performance.now();

  event.respondWith(
    fetch(event.request).then(function(response) {

      var ht1 = performance.now(),
          hmillisec = Math.round(ht1 - ht0),
          hseconds = Math.round(hmillisec/1000);

      //console.log(event);
      //console.log(response);
      
      var hstatus = (response.status).toString();

      //bij een error of trage request: event sturen naar google analytics
      if ( hstatus.charAt(0) == '4' || hstatus.charAt(0) == '5' || hmillisec > 5000 ) {
        //bepalen van pagina url
        var hstr = event.request.referrer || 'No referrer',
            hdelimiter = ':',
            hstart = 3,
            htokens = hstr.split(hdelimiter).slice(0,hstart),
            hpage = htokens.join(hdelimiter); //substr tot na de 3de dubbelpunt, geeft "f?p=app:page"

        //category bepalen
        var hcategory;
        if (hstatus.charAt(0) == '4' || hstatus.charAt(0) == '5') {
          hcategory = 'Error ' + hstatus;
        } else {
          hcategory = 'Slow request ';
          if (hmillisec < 10000) {
            hcategory = hcategory + '5-10s';
          } else if (hmillisec < 20000) {
            hcategory = hcategory + '10-20s';
          } else if (hmillisec < 30000) {
            hcategory = hcategory + '20-30s';
          } else if (hmillisec < 60000) {
            hcategory = hcategory + '30-60s';
          } else if (hmillisec < 120000) {
            hcategory = hcategory + '60-120s';
          } else if (hmillisec < 1800000) {
            hcategory = hcategory + '120-180s';
          } else if (hmillisec < 2400000) {
            hcategory = hcategory + '180-240s';
          } else if (hmillisec < 3000000) {
            hcategory = hcategory + '240-300s';
          } else if (hmillisec < 6000000) {
            hcategory = hcategory + '300-600s';
          } else {
            hcategory = hcategory + '600-...s';
          }
        }

        //Create hit data
        var payloadData = {
          v: 1,                                         //Version Number
          cid: Math.round(2147483647 * Math.random()),  //Client ID
          tid: 'UA-31746101-13',                        //Tracking ID 
          t: 'event',                                   //Hit Type
          dl: hpage,                                    //Location url
          ec: hcategory,                                //Event Category
          ea: hpage,                                    //Event Action
          el: event.request.url                         //Event Label
        };

        //Format hit data into URI
        var payloadString = Object.keys(payloadData)
        .filter(function(analyticsKey) {
          return payloadData[analyticsKey];
        })
        .map(function(analyticsKey) {
          return analyticsKey + '=' + encodeURIComponent(payloadData[analyticsKey]);
        })
        .join('&');

        //Post to Google Analytics endpoint
        fetch('https://www.google-analytics.com/collect', {
            method: 'post',
            body: payloadString
          });
      }

      //return the response to the page.
      return response;

    })
  )


});
*/