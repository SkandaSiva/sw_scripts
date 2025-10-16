'use strict';

self.importScripts('https://integration.mobile-mbox.com/webpush/sas-push-5/push-handler.js');

self.addEventListener('push', function(event) {
    SasWebPushHandler.handlePush(event);
});

self.addEventListener('notificationclick', function(event) {
    SasWebPushHandler.handleNotificationClick(event);
});

self.addEventListener('notificationclose', function (event) {
    SasWebPushHandler.handleNotificationClose(event);
});

self.addEventListener('message', function(event){
    SasWebPushHandler.handleMessage(event);
});
