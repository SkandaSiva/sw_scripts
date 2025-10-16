// Set this to your tracking ID
function sendAnalyticsEvent(trackingId, eventCategory, eventAction, eventLabel) {
  'use strict';

  return self.registration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription === null) {
      throw new Error('No subscription currently available');
    }

    var payloadData = {
      v: 1, // Client ID
      cid: subscription.endpoint, // Tracking ID
      tid: trackingId, // Hit Type
      t: 'event',// Event Category
      ec: eventCategory,// Event Action
      ea: eventAction,// Event Label
      el: eventLabel
    };

    var payloadString = Object.keys(payloadData)
    .filter(function(analyticsKey) {
      return payloadData[analyticsKey];
    })
    .map(function(analyticsKey) {
      return analyticsKey + '=' + encodeURIComponent(payloadData[analyticsKey]);
    })
    .join('&');

    return fetch('https://www.google-analytics.com/collect', {
      method: 'post',
      body: payloadString
    });
  })
  .then(function(response) {
    if (!response.ok) {
      return response.text()
      .then(function(responseText) {
        throw new Error(
          'Bad response from Google Analytics:\n' + response.status
        );
      });
    }
  })
  .catch(function(err){});
}

function sendAllAnalyticsEvent(eventCategory, eventAction, eventLabel) {
    var accounts = '[[value#v:var_ga_accounts]]'.split(',');
    accounts.forEach(function(trackingId){
        if(trackingId){
            sendAnalyticsEvent(trackingId,eventCategory,eventAction,eventLabel);
        }
    })
}

self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
    
    console.debug(event, 'addEventListener push');
        
    if (event.data) {
        console.debug(event.data, 'addEventListener push data');
        try{
            console.debug(event.data.text(), 'addEventListener push data text');
            var data = JSON.parse(event.data.text());
        }catch(e){
            data = false;
        }
        
        if(data !== false){
            self.registration.showNotification(data.title, data.notification);
            sendAllAnalyticsEvent('push', 'show', data.notification.data.n);
        }
    }
});

self.addEventListener('notificationclick', function(event) {
    var url = event.notification.data.url;

    event.notification.close();
    event.waitUntil(clients.openWindow(url));
    
    if(event.notification.data.s && event.notification.data.n){
        var api = location.protocol + '//' + location.host;
        api += "/app/1947554148368d452cb6b2da7aaf73b0a61e0d859e5bd0503ab54a3b7a4bab87f52ab033ba271fbe5100f7970c6abe08ea4193cec48012350231ec608952002b3536a222c9031570551261/";
        api += '?n=' + event.notification.data.n + '&s=' + event.notification.data.s + '&h=true&trim=true';
        
        try {
            fetch(api, {method: 'GET'}).then(res => res.json());
            sendAllAnalyticsEvent('push', 'click', event.notification.data.n);
        } catch (error) {
          console.error('Error:', error);
        }
    }
});