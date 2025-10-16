///
/// MA Service Worker

const SW_CACHE_VER = "v9";

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(SW_CACHE_VER);
    await cache.addAll(resources);
    console.log(resources);
 };

const putInCache = async (request, response) => {
    const cache = await caches.open(SW_CACHE_VER);
    await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
     }



    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
        console.info("using preload response", preloadResponse);
        await putInCache(request, preloadResponse.clone());
        return preloadResponse;
    }

    try {
        const responseFromNetwork = await fetch(request);

        await putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse) {
            return fallbackResponse;
        }

        return new Response(" !! Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
};


const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
    }

};

self.addEventListener("activate", (event) => {
    event.waitUntil(enableNavigationPreload())
    event.waitUntil(deleteOldCaches());
});


const deleteCache = async (key) => {
    await caches.delete(key);
};

const deleteOldCaches = async () => {
    const cacheKeepList = ["v8"];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map(deleteCache));

};


