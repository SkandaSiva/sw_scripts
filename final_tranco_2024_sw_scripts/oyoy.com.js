self.addEventListener('message', function (event) {
    try {
        var o = JSON.parse(event.data);
        console.log(event.data);
        console.log(o);
        if (o.messageType === 'shownotification') {
            console.log('cnjs -----> local message shownotification received');
            event.waitUntil(self.registration.showNotification(o.title, {
                body: o.body,
                icon: o.icon,
                badge: o.badge,
                tag: o.tag,
                renotify: o.renotify,
                data: { url: o.url }
            }));
        }
    }
    catch (exception) {
        console.log('cnjs -----> message receive exception: ' + exception.message);
    }
});

self.addEventListener('push', function (event) {
    const promiseChain = isClientFocused()
        .then((clientIsFocused) => {
            var o = event.data.json();

            if (o.tag !== 'settings' && clientIsFocused) {
                console.log('cnjs -----> client is focused (and tag is not settings) - do not need to show a notification');
                return null;
            }

            // client is not focused (and tag is not settings) - we need to show a notification
            return self.registration.showNotification(o.title, {
                body: o.body,
                icon: o.icon,
                badge: o.badge,
                tag: o.tag,
                renotify: o.renotify,
                data: { url: o.url }
            });
        });

    event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    })
        .then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                if (windowClients[i].url === urlToOpen) return windowClients[i].focus();
            }
            return clients.openWindow(urlToOpen);
        });

    event.waitUntil(promiseChain);
});

function isClientFocused() {
    return clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    })
        .then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) if (windowClients[i].focused) return true;
            return false;
        });
}

self.addEventListener('fetch', function (event) {
    try {
        if (typeof (event.request) !== 'undefined' && event.request.mode === 'navigate' && typeof (event.request.headers) !== 'undefined' && event.request.headers.get('accept').includes('text/html')) {
            console.log('%ccnjs -----> Fetching ' + event.request.url, 'color: blue');

            event.respondWith(
                fetch(event.request).catch(function () {
                    console.log('%ccnjs -----> Device or server is offline', 'color: red');
                    return new Response('<!DOCTYPE html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes, interactive-widget=resizes-content"/><meta name="theme-color" content="#000"/><title>Offline</title></head><body><style>body{font-family: sans-serif; line-height: 1.61803398875; background-color: #000; color: #fff; background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\' viewBox=\'0 0 8 8\'%3E%3Cg fill=\'%23262626\' fill-opacity=\'0.6\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M0 0h4v4H0V0zm4 4h4v4H4V4z\'/%3E%3C/g%3E%3C/svg%3E"); text-align: center;}.bttn{text-decoration: none; cursor: pointer; padding: 0 1em; text-align: center; min-width: 200px; line-height: 2.5em; display: inline-block; border: 1px solid #1a2433; border-radius: 2px; box-sizing: border-box; -webkit-user-select: none; user-select: none; background-color: #1d2939; color: #adb5bd; box-shadow: 0 0 1px rgba(0,0,0,0.1);}.bttn:hover{border: 1px solid #141c27; box-shadow: 0 1px 2px rgba(0,0,0,0.2)}.bttn:active{box-shadow: inset 0 1px 2px rgba(0,0,0,0.2)}</style><h1>Offline</h1><div><style>.spinner{margin: 20px auto; width: 40px; height: 80px; position: relative;}.cube1, .cube2{background-color: red; width: 30px; height: 30px; position: absolute; top: 0; left: 0; -webkit-animation: sk-cubemove 1.8s infinite ease-in-out; animation: sk-cubemove 1.8s infinite ease-in-out;}.cube2{-webkit-animation-delay: -0.9s; animation-delay: -0.9s;}@-webkit-keyframes sk-cubemove{25%{-webkit-transform: translateX(42px) rotate(-90deg) scale(0.5)}50%{-webkit-transform: translateX(42px) translateY(42px) rotate(-180deg)}75%{-webkit-transform: translateX(0) translateY(42px) rotate(-270deg) scale(0.5)}100%{-webkit-transform: rotate(-360deg)}}@keyframes sk-cubemove{25%{transform: translateX(42px) rotate(-90deg) scale(0.5); -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);}50%{transform: translateX(42px) translateY(42px) rotate(-179deg); -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);}50.1%{transform: translateX(42px) translateY(42px) rotate(-180deg); -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);}75%{transform: translateX(0) translateY(42px) rotate(-270deg) scale(0.5); -webkit-transform: translateX(0) translateY(42px) rotate(-270deg) scale(0.5);}100%{transform: rotate(-360deg); -webkit-transform: rotate(-360deg);}}</style> <div class="spinner"><div class="cube1"></div><div class="cube2"></div></div></div><p>Trying to reconnect...</p><p>Please check your Internet connection.</p><p>If your Internet connection is OK, please wait for the server to come back online.</p><br/><a href="' + event.request.url + '" class="bttn">Try again</a><script>setTimeout(function (){window.location.href="' + event.request.url + '";}, 5000); </script></body></html>', { headers: { 'Content-Type': 'text/html' } });
                })
            );
        }
    }
    catch (e) { }
});