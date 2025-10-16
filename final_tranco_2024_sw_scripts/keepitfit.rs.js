const cacheName = 'v1.35';

self.addEventListener('install', (e) => {
    //console.log('swinstalled');
});

self.addEventListener('activate', (e) => {
    //console.log('swactivated');
    e.waitUntil(
        caches.keys().then((cacheKeys) => {
            //console.log(cacheKeys)
            return new Promise((resolve, reject) => {
                for (let i = 0; i < cacheKeys.length; i++) {
                    if (cacheKeys[i] != cacheName) {
                        caches.delete(cacheKeys[i]);
                    }
                }
                resolve();
            });
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        new Promise((resolve, reject) => {
            if (e.request.method == 'GET') {
                caches.open(cacheName).then((cache) => {
                    cache.match(e.request).then((respCached) => {
                        if (respCached == undefined) {
                            // not cached
                            fetch(e.request).then((res) => {
                                if (doCache(e.request.url)) {
                                    // cache response
                                    let response = res.clone();
                                    caches.open(cacheName).then((cache) => {
                                        cache.put(e.request, response);
                                    });
                                }
                                //return res;
                                resolve(res);
                            })
                            .catch(() => {
                                resolve('');
                            })
                        } else {
                            // cached
                            //console.log('responding from cache')
                            resolve(respCached);
                        }
                    });
                });

                /*
                caches.match(e.request).then((respCached) => {
                    if (respCached == undefined) {
                        // not cached
                        fetch(e.request).then((res) => {
                            if (doCache(e.request.url)) {
                                // cache response
                                let response = res.clone();
                                caches.open(cacheName).then((cache) => {
                                    cache.put(e.request, response);
                                });
                            }
                            //return res;
                            resolve(res);
                        })
                        .catch(() => {
                            resolve('');
                        })
                    } else {
                        // cached
                        console.log('responding from cache')
                        resolve(respCached);
                    }
                });
                */
            } else {
                fetch(e.request).then((res) => {
                    //return res;
                    resolve(res);
                })
            }
        })
    )
});

function doCache(url) {
    return /\.js$/.test(url) || /\.css$/.test(url) || /\.png$/.test(url);
}