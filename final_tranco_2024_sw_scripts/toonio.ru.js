/*const cacheName = 'toonio';
const precachedResources = ['/draw', 'editor',
                            '/icons/css/all.css?v3', '/css/light.theme.css', '/css/dark.theme.css', '/css/toonio.css',
                            '/js/app/gif/gif.js', '/js/app/ffmpeg/ffmpeg.min.js', '/js/app/pako.min.js', 
                            '/js/app/pipe_client.js', '/js/app/src/jsmediatags.min.js',
                            '/js/app/src/entities.js', '/js/app/src/erase.js', '/js/app/src/tools.js', '/js/app/src/toon.js', '/js/app/src/autosave.js', '/js/app/src/toonio.js'];

async function networkFirst(request)
{
    try
    {
        let networkResponse = await fetch(request);
        if (networkResponse.ok)
        {
            let cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }
    catch(e)
    {
        const cachedResponse = await caches.match(request);
        return cachedResponse || Response.error();
    }
}  

self.addEventListener('fetch', (e) => 
{
    let url = new URL(e.request.url);
    if(url.pathname.indexOf('/Server/') == -1) 
        e.respondWith(networkFirst(e.request));
});*/

function sendNotification(_data) 
{
    return self.registration.showNotification(_data.title,
    {
        'body': _data.text,
        'tag': _data.tag,
        'timestamp': _data.timestamp * 1000,
        'icon': _data.icon,
        'badge': _data.badge,
        'data':
        {
            'url':  _data.url
        },
    });
}

function removeNotification(_data)
{
    return self.registration.getNotifications().then(notifications =>
    {
        for(let i = 0; i < notifications.length; i++)
        {
            if(notifications[i] && notifications[i].tag == _data.close)
                return notifications[i].close();
        }
    });
}

self.addEventListener('push', async (e) =>
{
    if (!(self.Notification && self.Notification.permission == 'granted'))
		return;

    if (e.data)
    {
        let data = e.data.json();

        if(data.close)
            e.waitUntil(removeNotification(data));
        else
            e.waitUntil(sendNotification(data));
    }
});

self.addEventListener('notificationclick', (e) =>
{
    let url = e.notification.data.url;
    e.notification.close();

    e.waitUntil(clients.matchAll({
        type: "window"
    }).then((clientList) =>
    {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == url && 'focus' in client)
                return client.focus();
        }
        if (clients.openWindow)
            return clients.openWindow(url);
    }));
});
