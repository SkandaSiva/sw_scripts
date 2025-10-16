var iinfo = iinfo || {};
iinfo.pushNotifications = iinfo.pushNotifications || {};
/**
 * @param { String } hash
 * @param { String } title
 * @param { String } text
 * @param { String|null } url
 * @param { String|null } iconUrl
 * @constructor
 */
iinfo.pushNotifications.Notification = function (hash, title, text, url, iconUrl) {
this.hash = hash;
this.title = title;
this.text = text;
this.url = url === undefined ? null : url;
this.iconUrl = iconUrl === undefined ? null : iconUrl;
};
/**
 * @returns { String }
 */
iinfo.pushNotifications.Notification.prototype.getHash = function () {
return this.hash;
};
/**
 * @returns { String }
 */
iinfo.pushNotifications.Notification.prototype.getTitle = function () {
return this.title;
};
/**
 * @returns { String }
 */
iinfo.pushNotifications.Notification.prototype.getText = function () {
return this.text;
};
/**
 * @returns { String|null }
 */
iinfo.pushNotifications.Notification.prototype.getUrl = function () {
return this.url;
};
/**
 * @returns { String|null }
 */
iinfo.pushNotifications.Notification.prototype.getIconUrl = function () {
return this.iconUrl;
};
/**
 * Vytvoří instanci z JSON
 * @param { String } json
 */
iinfo.pushNotifications.Notification.fromJson = function (json) {
try {
var jsonObj = JSON.parse(json);
if (jsonObj.hash === undefined || jsonObj.title === undefined || jsonObj.alert === undefined)
return null;
return new iinfo.pushNotifications.Notification(jsonObj.hash, jsonObj.title, jsonObj.alert, jsonObj.custom.u, jsonObj.icon);
} catch (e) {
}
return null;
};
self.addEventListener('install', function () {
// Zajistí okamžité nahrání nového SW bez nutnosti vypnout prohlížeč
self.skipWaiting();
});
//event Listener co obsluhuje kliknutí na notifikaci
self.addEventListener('notificationclick', function (event) {
var notification = event.notification;
event.notification.close();
var fd = new FormData();
fd.append('notificationHash', notification.tag);
fetch("/pushnotification/api/update-click-time/", {
method: 'POST',
body: fd
});
if(notification.data === undefined || notification.data === null)
return;
var url = notification.data.url;
if (url !== undefined && url != null) {
event.waitUntil(
clients.matchAll({ type: 'window' }).then(function (windowClients) {
for (var i = 0; i < windowClients.length; i++) {
var client = windowClients[i];
if (client.url === url && 'focus' in client) {
return client.focus();
}
}
if (clients.openWindow) {
return clients.openWindow(url);
}
})
);
}
});
//event Listener co obsluhuje příjem notifikace
self.addEventListener('push', function (event) {
var notification = iinfo.pushNotifications.Notification.fromJson(event.data.text());
if (notification === null)
return;
var fd = new FormData();
fd.append('notificationHash', notification.getHash());
fetch("/pushnotification/api/update-delivery-time/", {
method: 'POST',
body: fd
});
if (!(self.Notification && self.Notification.permission === 'granted')) {
return;
}
var sendNotification = function (pushNotification) {
var options = {
body: pushNotification.getText(),
tag: pushNotification.getHash(),
requireInteraction: true,
};
if (pushNotification.getIconUrl() != null) {
options.icon = pushNotification.getIconUrl();
}
if (pushNotification.getUrl() != null) {
options.data = { url: pushNotification.getUrl() };
}
var showNotificationPromise = self.registration.showNotification(pushNotification.getTitle(), options);
showNotificationPromise.then(function () {
var fd = new FormData();
fd.append('notificationHash', pushNotification.getHash());
fetch("/pushnotification/api/update-display-time/", {
method: 'POST',
body: fd
});
});
return showNotificationPromise;
};
if (!event.data) {
return;
}
event.waitUntil(sendNotification(notification));
});