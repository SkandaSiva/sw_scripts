/*
 * fCMS - fidion Content Management System
 * fidion GmbH, Würzburg - (https://www.fidion.de)
 */

/**
 * fCMS-Service-Worker für Web-Pushes
 */

/**
 * Installation des Service-Workers.
 *
 * Das skipWaiting führt dazu dass der fCMS-Serviceworker
 * sofort aktiv wird. Ein anderer Serviceworker wird damit
 * umgehend rausgeworfen. Ansonsten wird der Serviceworker
 * erst nach einem Reload aktiv (was hinsichtlich der
 * Push-Service-Abonnierung problematisch ist => falsche Endpoint-URL!)
 */
self.addEventListener('install', function (event) {

    self.skipWaiting();
});

/**
 * Behandlung der vom Server versendeten Push-Nachricht
 *
 * Die Nachricht wird als Notification angezeigt.
 */
self.addEventListener('push', function (event) {

    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    if (!event.data) {
        return;
    }

    var payload = event.data.json();
    var title = payload.title || '';
    var message = payload.notice || '';
    var iconPath = payload.iconPath || '';
    var badgePath = payload.badgePath || '';
    var expireTimeMs = payload.expireTimeMs || 0;

    /*
     * Ist eine Expire-Zeit gesetzt und die Expire-Zeit liegt in der
     * Vergangenheit, wird die Pushnachricht nicht angezeigt
     */
    if (expireTimeMs > 0 && expireTimeMs < Date.now()) {
        return;
    }

    var promiseChain = self.registration.showNotification(
        title,
        {
            body: message,
            data: payload,
            icon: iconPath,
            badge: badgePath,
            image: payload.imagePath || '',
            requireInteraction : payload.requireInteraction || false
        }
    ).then(() => {
        return callWs(
            'setDisplayed',
            {
                'pushId' : payload.pushId,
                'os' : payload.userAgent,
                'token' : payload.deviceToken
            }
        );
    });

    event.waitUntil(promiseChain);;
});

/**
 * Behandlung wenn auf die Nachricht geklickt wird.
 *
 * Zu der Ziel-Url der Notification wird ein Browser-Window / Tab
 * gesucht. Ist dieses schon geöffnet wird der Tab fokusiert. Andernfalls
 * wird ein neues Fenster geöffnet. Danach wird die Notification geschlossen
 */
self.addEventListener('notificationclick', function(event) {

    var notification = event.notification;
    var notificationData = event.notification.data;

    notification.close();
    callWs(
        'setOpened',
        {
            'pushId' : notificationData.pushId,
            'os' : notificationData.userAgent,
            'token' : notificationData.deviceToken
        }
    );

    var urlToOpen = new URL(notificationData.shortUrl, self.location.origin).href;
    var promiseChain = self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(function(windowClients) {
        var matchingClient = null;

        windowClients.some(function(windowClient) {

            if (windowClient.url === urlToOpen) {
                matchingClient = windowClient;
                return true;
            }

            return false;
        });

        if (matchingClient) {
            return matchingClient.focus();
        } else {
            return self.clients.openWindow(urlToOpen);
        }
    });

    event.waitUntil(promiseChain);
});

/**
 * aktualisiert das Öffnungsdatum der Message im fCMS via Webservice
 *
 * @return void
 */
function callWs(wsFunc, wsData) {

    var formData = new FormData();
    formData.append('fWSin', JSON.stringify(wsData));

    return fetch('/_fWS/json/PushNotification_Message/0/' + wsFunc + '/', {
        method : 'post',
        body   : formData
    });
}