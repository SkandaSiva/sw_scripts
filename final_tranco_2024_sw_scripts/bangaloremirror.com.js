
    
        'use strict';
         importScripts('https://static.growthrx.in/js/v2/push-sw.js');
         self.addEventListener('notification_received', function(e){
            console.log("Notification Received", e.detail);
            var landingUrl = e.detail.url.length ? e.detail.url : "https://bangaloremirror.indiatimes.com/";
            var _url = ap(landingUrl);
            sendAnalyticsEvent('notification_view', _url);
         });
         self.addEventListener('notification_opened', function(e){
            console.log("Notification Opened", e.detail);
            var landingUrl = e.detail.url.length ? e.detail.url : "https://bangaloremirror.indiatimes.com/";
            var _url = ap(landingUrl);
            sendAnalyticsEvent('notification_click', _url);
         });
         self.addEventListener('notification_closed', function(e){
             console.log("Notification Opened", e.detail);
             var landingUrl = e.detail.url.length ? e.detail.url : "https://bangaloremirror.indiatimes.com/";
             var _url = ap(landingUrl);
              sendAnalyticsEvent('notification_close', _url)
         });
         
         function sendAnalyticsEvent(eventAction,eventLabel) {
            var trackingId = 'UA-4552483-1';
            if (!trackingId) { return Promise.resolve();}
            if (!eventAction && !eventLabel) { return Promise.resolve();}
              return self.registration.pushManager.getSubscription().then(function(subscription) {
               //if (subscription === null) {throw new Error('No subscription currently available.');}
                //var regId = subscription.endpoint.split("/").slice(-1);
                var _cid = (subscription != undefined && subscription != null) ? subscription.endpoint : "544393093.1583242017";
                var mergeParams = eventAction +'|'+eventLabel;
                var property = 'BM';
                
                var section  = getSection(eventLabel);
                
                var payloadData = {v: 2,cid: _cid, tid: trackingId, t: 'event', en: 'Browser_Notifications','ep.eventAction':eventAction, 'ep.property':property, 'ep.section':section, dl:eventLabel};
                //{v: 2,cid: regId,tid: trackingId,t: 'event',en: 'ETnotifications','ep.eventAction':mergeParams};
                
                
                const payloadString = Object.keys(payloadData)
                  .filter(analyticsKey => {
                    return payloadData[analyticsKey];
                  })
                  .map(analyticsKey => {
                    return `${analyticsKey}=` +
                      encodeURIComponent(payloadData[analyticsKey]);
                  })
                  .join('&');
          
                //var payloadString = Object.keys(payloadData).filter(function(analyticsKey) {return payloadData[analyticsKey];}).map(function(analyticsKey) {
                //  return analyticsKey + '=' + encodeURIComponent(payloadData[analyticsKey]);}).join('&');
                return fetch('https://www.google-analytics.com/g/collect?'+payloadString);
                /*return fetch('https://www.google-analytics.com/g/collect', {
                    method: 'post',
                    body: payloadString
                  });*/
              }).then(function(response) {
                 console.log("GA call response object");
                 console.log(response);
                if (!response.ok) {
                    console.log("GA call not sent fro service worker");
                  return response.text().then(function(responseText) {
                    throw new Error('Bad response from Google Analytics:\n' + response.status);
                  });
                }else{
                    console.log("GA call sent fro service worker");  
                }
              }).catch(function(err) {console.log('Unable to send the analytics event', err);});
            }
            function getSection(u){
                var u = (u.indexOf("?") >=0 ) ? u.split("?")[0] : u;
                var sourceString = u.replace('http://','').replace('https://','').split(/[/?#]/)[0];
                var domain = "https://" + sourceString + "/";
                return u.replace(domain,"").split("/")[0];
            }
            function ap(u){
                var p ="utm_source=Browser_Notification&utm_medium="+getBrowser()+"&utm_campaign=BM_Browser_Notification",
                    pre = "?",
                    url = (u.indexOf('?')!=-1) ? u.split("?")[0] : u;
                return (url + pre + p);
            }
            function getBrowser(){
                if(/Chrome/i.test(navigator.userAgent)){
                    return 'chrome';
                }
                else if(/firefox/i.test(navigator.userAgent)){
                    return 'mozilla';
                }
                return '';
            }
         
        
     
	