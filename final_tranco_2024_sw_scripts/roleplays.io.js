
// Core assets
let coreAssets = ["https:\/\/roleplays.io\/gzip_loader.php?file=bx_templ_css_353d4fafc0c02dd65a8e5d2da9f4ce30.css","https:\/\/roleplays.io\/gzip_loader.php?file=bx_templ_js_c7b87a960244cd6dfa123279247f0689.js","https:\/\/roleplays.io\/s\/sys_files\/8xzaju6njsegcusj4kye8fgm2kmj6sa6.png","https:\/\/roleplays.io\/modules\/boonex\/fontawesome\/template\/fonts\/fa-solid-900.woff2","https:\/\/roleplays.io\/modules\/boonex\/fontawesome\/template\/fonts\/fa-regular-400.woff2"];

// On install, cache core assets
self.addEventListener('install', function (event) {
    self.skipWaiting();
    // Cache core assets
    event.waitUntil((async () => { 
        caches.open('app196').then(function (cache) {
            for (let asset of coreAssets) {
                cache.add(new Request(asset));
            }
            return cache;
        });
    })());
});

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = ["app196"];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

// delete old cache on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});

// Listen for request events
self.addEventListener('fetch', function (event) {

    // Get the request
    let request = event.request;

    // Bug fix
    // https://stackoverflow.com/a/49719964
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

    // regular pages and static assets
    if (request.mode === 'navigate' || request.url.match(/\.(css|js|woff2|svg|png|jpg)$/)) {
        const failedResponse = async (err) => {
            let reponse = null;
            const sOfflinePage = '';
            if (request.mode === 'navigate' && sOfflinePage.length != 0) {
                const cache = await caches.open('app196');
                reponse = await cache.match(sOfflinePage);
            }
            return reponse || new Response("Network error happened", {
                status: 408,
                headers: { "Content-Type": "text/plain" },
            });
        }
        event.respondWith(
            caches.match(request).then((response) => {
                try {
                    return response || fetch(request)
                        .then((response) => {
                            return response;
                        })
                        .catch((err) => {
                            return failedResponse(err);
                        });
                } catch (error) {
                    return failedResponse(err);
                }
            })
        );
    }

});
