/* eslint-disable */
//KOD SKOPIOWANY OD PLAY, POSTĘPUJ OSTROŻNIE

var title = '';
var body = '';
var icon = '';
var image = '';
var targetUrl = '';
var actions = '';

var reregisterUrl = 'https://cmg.play.pl/cmg/api/mobile/reregister-browser';

self.addEventListener('push', function(event)
{
    if (event.data)
    {
        var obj = event.data.json();
        var messageId = obj.message_id;
        var applicationId = obj.application_id;
        var fetchUrl = obj.fetch_url;
        var message = "message_id=" + messageId + ";application_id=" + applicationId + Math.random().toString(36).substring(2,6);
        event.waitUntil(
            fetch(fetchUrl,
            {
                method: 'post',
                headers:
                {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: "data=" + message
            })
            .then(function (response)
            {
                if (response.status === 200)
                {
                    return response.json();
                }
            })
            .then(function(data)
            {
                if (data !== undefined)
                {
                    title = data.dialog.title;
                    body = data.dialog.content;
                    icon = data.dialog.icon;
                    image = data.dialog.image;
                    if (data.args.actions !== undefined)
                    {
                        actions = data.args.actions;
                    }
                    else
                    {
                        actions = '';
                    }
                    if (data.args.url !== undefined)
                    {
                        targetUrl = data.args.url;
                    }
                    else
                    {
                        targetUrl = '';
                    }
                    if (targetUrl.length > 0 || actions.length > 0)
                    {
                        self.addEventListener('notificationclick', function(event)
                        {
                            for (var i in actions)
                            {
                                if (actions[i].action === event.action)
                                {
                                    clients.openWindow(actions[i].url);
                                    return false;
                                }
                            }
                            if (targetUrl.length > 0)
                            {
                                clients.openWindow(targetUrl);
                            }
                        });
                    }
                    return self.registration.showNotification(title,
                    {
                        body: body,
                        icon: icon,
                        image: image,
                        requireInteraction: true,
                        actions: actions
                    });
                }
            })
            .catch(function (error)
            {
            })
        );
    }

});

self.addEventListener('pushsubscriptionchange', function(event)
{
    var oldEndpoint = '';
    self.registration.pushManager.getSubscription().then(function (subscription)
    {
        if (subscription)
        {
            oldEndpoint = subscription.endpoint;
        }
    });
    event.waitUntil(self.registration.pushManager.subscribe(
    {
        userVisibleOnly: true
    })
    .then(function(subscription)
    {
        var jsonSubscription = subscription.toJSON();
        var newEndpoint = jsonSubscription.endpoint;
        var auth = jsonSubscription.keys.auth;
        var p256dh = jsonSubscription.keys.p256dh;
        var message = "old_endpoint=" + oldEndpoint + ";new_endpoint=" + newEndpoint + ";auth_key=" + auth.toString() + ";p256dh_key=" + p256dh.toString() + Math.random().toString(36).substring(2,6);
        fetch(reregisterUrl,
        {
            method: 'post',
            headers:
            {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: "data=" + message
        })
        .then(function (response)
        {
        });
    }));
});

self.addEventListener('registration', function(event)
{
});

self.addEventListener('activate', function(event)
{
    event.waitUntil(self.clients.claim());
});

self.addEventListener('install', function(event)
{
    event.waitUntil(self.skipWaiting());
});
