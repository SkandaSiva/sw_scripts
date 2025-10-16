'use strict';
let notificationUrl = '';
let host = self.location.host;
let param_site = 'apk_' + host.substring(0, host.indexOf('.'));
function getQueryVariable(variable, url) {
    console.log('use ----- getQueryVariable')
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

self.addEventListener('push', function (event) {

    let _data = event.data ? JSON.parse(event.data.text()) : {};
    let _badge = _data.b ? _data.b : '';
    let _image = _data.img ? _data.img : '';
    notificationUrl = _data.url;

    const title = _data.title;
    const options = {
        body: _data.message,
        icon: _data.icon,
        image: _image,
        badge: _badge,
        requireInteraction: true,
        data: notificationUrl,
        vibrate: [300, 100, 400]
    };

    if (_data.action !== undefined) {
        let _action = _data.action ? _data.action : 'Open';
        options.actions = [{
            action: 'open-action',
            title: _action,
            icon: 'https://cdn.apkpac.com/images/notification/apk/apkpac.png',
        }];
    }

    event.waitUntil(self.registration.showNotification(title, options).then(function () {
        var utm_source = getQueryVariable("utm_source", notificationUrl);
        let e = {
            site: param_site,
            u_s: utm_source
        };
        fetch("https://www.silverglad.com/show-impression7", {
            mode: "no-cors",
            body: JSON.stringify(e),
            method: "POST",
            headers: {
                'content-type': 'application/json'
            }
        }).then(function (e) {
            return;
        })
    }));
});

self.addEventListener('notificationclick', function (event) {

    event.notification.close();

    var redirectUrl = null;
    if (event.notification.data) { //seems that background notification shown by system sends data this way
        redirectUrl = event.notification.data ? event.notification.data : null;
    } else {  //show manually using showNotification
        redirectUrl = 'https://www.apkpac.com/';
    }

    event.waitUntil(
        clients.openWindow(redirectUrl)
    );

    self.registration.pushManager.getSubscription().then(function (subscription) {
        var end_point = subscription.endpoint;
        var utm_source = getQueryVariable("utm_source", redirectUrl);
        let e = {
            site: param_site,
            endpoint: end_point,
            url: redirectUrl,
            utm_source: utm_source
        };
        fetch("https://www.silverglad.com/click-action7", {
            mode: "no-cors",
            body: JSON.stringify(e),
            method: "POST",
            headers: {
                'content-type': 'application/json'
            }
        }).then(function (e) {
            return;
        })
    });
});
self.addEventListener('fetch',function(event){});