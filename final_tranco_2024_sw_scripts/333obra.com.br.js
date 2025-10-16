// Establish a cache name
let cacheName = '333Obra_cache_v9.9.0';

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
};

self.addEventListener('install', (event) => {
    event.currentTarget.cookieStore.getAll().then((cookies) => {
        const cacheVersionCookie = cookies.find(cookie => cookie.name === 'cacheVersion');
        if (cacheVersionCookie) {
            const cacheVersion = cacheVersionCookie.value;
            cacheName = cacheVersion
        }
    })

    console.log('installing service worker', cacheName);
    
    event.waitUntil(
        caches.open(cacheName)
    );
});

self.addEventListener('activate', (event) => {
    event.currentTarget.cookieStore.getAll().then((cookies) => {
        const cacheVersionCookie = cookies.find(cookie => cookie.name === 'cacheVersion');
        if (cacheVersionCookie) {
            const cacheVersion = cacheVersionCookie.value;
            cacheName = cacheVersion
        }
    })

    console.log('activating service worker', cacheName);

    event.waitUntil(caches.keys().then((cacheNames)=>{
        return Promise.all(cacheNames.map((cache)=> {
            if(cache != cacheName) {
                return caches.delete(cache)
            }
        }))
    }))
})

self.addEventListener('fetch', async (event) => {
    const url = new URL(event.request.url);
    const authority = url.hostname;

    event.currentTarget.cookieStore.getAll().then((cookies) => {
        const cacheVersionCookie = cookies.find(cookie => cookie.name === 'cacheVersion');
        if (cacheVersionCookie) {
            const cacheVersion = cacheVersionCookie.value;
            cacheName = cacheVersion
        }
    })

    event.waitUntil(caches.keys().then((cacheNames)=>{
        return Promise.all(cacheNames.map((cache)=> {
            if(cache != cacheName) {
                return caches.delete(cache)
            }
        }))
    }))

    if ((event.request.headers.get('Accept').includes('text/html')
        && url.pathname === '/' && event.request.referrer.includes('/customer/account/login')))
    {
        return;
    }
    
    if (
        authority.includes('333obra')
        && (!event.request.url.includes('entrega') && !event.request.url.includes('boleto'))
        && (event.request.destination === 'image' 
            || event.request.destination === 'font' 
            || event.request.destination === 'style' 
            || event.request.destination === 'script'
        )
        || (event.request.url.includes('googletagmanager.com/gtm'))
        || (event.request.url.includes('connect.facebook.net/en_US/fbevents.js'))
        || (event.request.url.includes('d335luupugsy2.cloudfront.net'))
        || (event.request.url.includes('www.clarity.ms'))
        || (event.request.url.includes('s3.amazonaws.com'))
        || (event.request.url.includes('plugins.crmback.io'))
    ) {
        event.respondWith(
            caches.open(cacheName).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request.url, { mode: 'no-cors' }).then((fetchedResponse) => {
                    cache.put(event.request, fetchedResponse.clone());

                    return fetchedResponse;
                });
            });
        }));
    } else {
        return;
    }
});
