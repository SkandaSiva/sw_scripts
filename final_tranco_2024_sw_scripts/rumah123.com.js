
    var DOC_CACHE = 'r123-doc';
    var PICTURE_CACHE = 'r123-picture';
    
    self.addEventListener('fetch', function(event) {
        event.respondWith(async function() {
            if (false === true) {
                const networkResponse = await fetch(event.request);
                return networkResponse;
            } else if (
                ( event.request.url.indexOf('https://www.rumah123.com') >= 0 && (event.request.url.indexOf('perumahan-baru/properti') >= 0||event.request.url.indexOf('en/new-launch/property') >= 0||event.request.url.indexOf('properti') >= 0||event.request.url.indexOf('en/property') >= 0) )
            ) {
                const cache = await caches.open(DOC_CACHE);
                return cache.match(event.request)
                    .then((cachedResponse) => {
                        if(!cachedResponse || cacheResponse.type === 'opaqueredirect') {
                            throw new Error();
                        }
                        return cachedResponse;
                    })
                    .then((cachedResponse) => {
                        fetch(event.request).then(async function(networkResponse) {
                            if (networkResponse.type !== 'opaqueredirect') {
                                const cache = await caches.open(DOC_CACHE);
                                cache.put(event.request, networkResponse);
                            }
                        })
                        return cachedResponse;
                    })
                    .catch(async function() {
                        const networkResponse = await fetch(event.request);
                        if (networkResponse.type !== 'opaqueredirect') {
                            event.waitUntil(
                                cache.put(event.request, networkResponse.clone())
                            );
                        }
                        return networkResponse;
                    })
            } else if (
                event.request.url.indexOf('https://picture.rumah123.com') >= 0
            ) {
                const cache = await caches.open(PICTURE_CACHE);
                return cache.match(event.request)
                    .then((cachedResponse) => {
                        if(!cachedResponse) {
                            throw new Error();
                        }
                        return cachedResponse;
                    })
                    .catch(async function() {
                        const networkResponse = await fetch(event.request);
                        event.waitUntil(
                            cache.put(event.request, networkResponse.clone())
                        );
                        return networkResponse;
                    })
            } else {
                return fetch(event.request);
            }
        }());
    });
