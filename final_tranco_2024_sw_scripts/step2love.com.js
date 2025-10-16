'use strict';


/**
 *
 */
self.addEventListener('push', function(event) {
  try {
    var notificationData = typeof event === 'object' && typeof event.data === 'object' && typeof event.data.json === 'function' ? event.data.json() || {} : {};
    event.waitUntil(self.registration.showNotification(notificationData.title, notificationData));
  } catch (e) {
    console.error('pushServiceWorker', e);
  }
});

/**
 *
 */
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var data = event.notification.data || {};
  event.waitUntil(self.clients.openWindow(data.url || '/'));
});

/**
 *
 */
self.addEventListener('install', function () {
  self.skipWaiting();
});

/**
 *
 */
self.addEventListener('activate', function(event) {});

/**
 *
 */
self.addEventListener('notificationclose', function (event) {});
