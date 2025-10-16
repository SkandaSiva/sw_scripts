var thiscache = 'verd41d8cd98f00b204e9800998ecf8427e:static';
self.addEventListener('install', function(e)
{
    e.waitUntil(
        caches.open(thiscache).then(function(cache)
        {
            return cache.addAll(
            [
                

            ]).then( function()
            {
                self.skipWaiting();
            });
        })
    );
});

self.addEventListener('activate', function(e)
{
    e.waitUntil(
        caches.keys().then(function(keyList)
        {
            return Promise.all(keyList.map(function(key)
            {
                if (key !== thiscache)
                {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(e)
{
    if(e.request.url.indexOf(',') > 1 || e.request.url.indexOf('contentteller.png') > 1 )
    {
        return;
    }
    e.respondWith(
        caches.match(e.request).then(function(response)
        {
            if (response)
            {
                return response;
            }
            return fetch(e.request);
        })
    );
});

self.addEventListener('push', function(e)
{
    if (e.data)
    {
        data = e.data.json();

        self.registration.showNotification(data.title,
        {
            body: data.body,
            icon: data.icon,
            image: data.image
        });
    }
});