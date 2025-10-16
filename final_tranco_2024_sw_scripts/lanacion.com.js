let pushtoken;

let trackingId = 'UA-621326-134';


self.addEventListener('install', function (event) {
    // Perform some task
});
self.addEventListener('activate', function (event) {
    // Perform some task
});

self.addEventListener('fetch', function (event) {
    
})


self.addEventListener('notificationclick', (event) => {
    event.preventDefault();
    event.notification.close();

    let data = event.notification.data;
    sendAnalyticsEvent('opened', 'notification', data);


    // Abre nota o home
    let url = event.target.location.origin + '/';
    if (data.url) {
        url = data.url
    } else if (data.notaid) {
        url = url + data.notaid;
    }

    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function (clientList) {

        const cls = clientList.find(c => {
            return c.visibilityState === 'visible';
        });

        if (cls) {
            // ya abierto
            cls.navigate(url).focus();
        } else {
            // nuevo 
            clients.openWindow(url);
        }
    }));
});

self.addEventListener('push', function (event) {
    let data = {};
    if (event.data) {
        data = event.data.json();
        data = data.data;
       
        console.log(data);
        sendAnalyticsEvent('received', 'notification', data);


        // Abre notificacion
        event.waitUntil(
            self.registration.showNotification(data.title, {
                icon: '/nt_icon.png',
                badge: '/pwa_128.png',
                body: data.message,
                image: data.image,
                vibrate: [100, 50, 100],
                tag: data.notaid,
                data: data              
            })
        );
    }
});




function sendAnalyticsEvent(eventAction, eventCategory, data) {
    'use strict';

    if (!trackingId) {
        console.error('You need your tracking ID in analytics-helper.js');
        console.error('Add this code:\nvar trackingId = \'UA-XXXXXXXX-X\';');
        return Promise.resolve();
    }

    if (!eventAction && !eventCategory) {
        console.warn('sendAnalyticsEvent() called with no eventAction or ' + 'eventCategory.');
        return Promise.resolve();
    }

    return self.registration.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription === null) {
                throw new Error('No subscription currently available.');
            }

            var payloadData = {
                v: 1,
                cid: subscription.endpoint,
                tid: trackingId,
                t: 'event',
                ec: eventCategory,
                ea: eventAction,
                el: data.titulo,
                cd1: data.notaid,
                cd2: data.sitioid,
                cd3: data.tipo,
                cd4: data.id
            };

            var payloadString = Object.keys(payloadData)
                .filter(function (analyticsKey) {
                    return payloadData[analyticsKey];
                })
                .map(function (analyticsKey) {
                    return analyticsKey + '=' + encodeURIComponent(payloadData[analyticsKey]);
                })
                .join('&');

            return fetch('https://www.google-analytics.com/collect', {
                method: 'post',
                body: payloadString
            });
        })
        .then(function (response) {
            if (!response.ok) {
                return response.text()
                    .then(function (responseText) {
                        throw new Error(
                            'Bad response from Google Analytics:\n' + response.status
                        );
                    });
            } else {
                console.log(eventCategory + '/' + eventAction + ' hit sent, check the Analytics dashboard');
            }
        })
        .catch(function (err) {
            console.warn('Unable to send the analytics event', err);
        });
}

