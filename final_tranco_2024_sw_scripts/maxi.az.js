importScripts('https://push.esputnik.com/service-worker.js');
// "use strict";
// var serviceOrigin = "https://push.esputnik.com";
// var currentVersion = "1.2";
//
// self.addEventListener('install', function(event) {
//     self.skipWaiting();
// });
//
// self.addEventListener('activate', function(event) {
//     event.waitUntil(trackNewServiceWorkerActivation());
// });
//
// self.addEventListener('push', onPushNotification);
//
// self.addEventListener('notificationclick', function(event) {
//     var link = determineClickedLink(event);
//     event.notification.close();
//
//     if (link) {
//         event.waitUntil(clients.openWindow(link));
//     }
// });
//
// function onPushNotification(event) {
//     console.log('Push message', event);
//
//     var p = new Promise(function(resolve, reject) {
//         try {
//             var notification = event.data
//                 ? event.data.json()
//                 : null;
//             resolve(notification);
//         } catch (error) {
//             resolve(null);
//         }
//     })
//         .then(function(notification) {
//             if (!notification) {
//                 return getNotificationContent();
//             }
//             return showNotification(notification)
//                 .then(function() {
//                     var json = JSON.stringify({
//                         id: notification.id
//                     });
//                     return fetch(serviceOrigin + '/v1/notification/read', {
//                         method: "POST",
//                         headers: {
//                             'Content-Type': 'application/json'
//                         },
//                         body: json
//                     });
//                 });
//         });
//
//     event.waitUntil(p);
// }
//
//
// function getNotificationContent() {
//     return self.registration.pushManager.getSubscription()
//         .then(function(subscription) {
//             return fetch(serviceOrigin + '/v1/notification/get?token='+encodeURIComponent(subscription.endpoint))
//                 .then(function(response) {
//                     if (response.status !== 200) {
//                         return;
//                     }
//                     return response.text().then(function(responseText) {
//                         console.log(responseText);
//                         var notification = JSON.parse(responseText);
//                         return showNotification(notification);
//                     });
//                 });
//         });
// }
//
//
// function showNotification(notification) {
//     if (notification) {
//         var options = notification.content;
//         options.data = getNotificationData(notification);
//         options.requireInteraction = notification.interactionRequired ? true : false;
//         return self.registration.showNotification(options.title, options);
//     }
//
// }
//
// function getNotificationData(notification) {
//     var data = {};
//     data.clickReference = notification.content.link;
//     data.notificationId = notification.id;
//     data.actionLinks = collectActionLinks(notification.content.actions);
//     return data;
// }
//
// function determineClickedLink(event) {
//     var data = event.notification.data;
//
//     if (data) {
//         if (event.action) {
//             return data.actionLinks[event.action];
//         } else {
//             return data.clickReference;
//         }
//     }
// }
//
// function collectActionLinks(actions) {
//     var actionLinks = {};
//     if (actions && actions.length > 0) {
//         actions.forEach(function(a) {
//             actionLinks[a.action] = a.link;
//         });
//     }
//     return actionLinks;
// }
//
// function trackNewServiceWorkerActivation() {
//     return self.registration.pushManager.getSubscription()
//         .then(function(subscription) {
//             if (!subscription) {
//                 return null;
//             } else {
//                 return subscription.endpoint;
//             }
//         })
//         .then(function(subscriptionEndpoint) {
//             if (subscriptionEndpoint) {
//                 return fetch(serviceOrigin + '/v1/subscription/sw/version', {
//                     method: "PUT",
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         version: currentVersion,
//                         endpoint: subscriptionEndpoint
//                     })
//                 });
//             }
//         })
//         .catch(function(error) {});
// }
