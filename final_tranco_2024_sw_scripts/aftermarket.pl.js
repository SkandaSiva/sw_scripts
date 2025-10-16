
var assets = "";

self.addEventListener("install", function(event) 
{
    assets = new URL(location).searchParams.get("assets");
});

self.addEventListener('activate', function(event) 
{
});


self.addEventListener('fetch', function(event) 
{
    var url = new URL(event.request.url);
    
    if(url.origin == assets && !/\.mp3$/.test(url.pathname))
    {
        event.respondWith(
            caches.open("assets").then(function(cache)
            {
                return cache.match(event.request, { "ignoreSearch": false }).then(function(response)
                {
                    return response || fetch(event.request).then(function(response)
                    {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});
