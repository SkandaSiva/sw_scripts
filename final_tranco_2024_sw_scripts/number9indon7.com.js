importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

if (workbox) {
    // console.log(`Yay! Workbox is loaded 🎉`);
    workbox.setConfig({ debug: false });

    self.addEventListener("install", event => {
        self.skipWaiting();

        // event.waitUntil(
        //   // caching etc
        // );
    });

    workbox.precaching.precacheAndRoute([]);

    // // member pages
    // workbox.routing.registerRoute(
    //     /^.*$/,
    //     new workbox.strategies.NetworkFirst({
    //         cacheName: 'pages-cache',
    //     })
    // );

    // js files
    workbox.routing.registerRoute(
        /\.(?:js)\?id=.*$/,
        new workbox.strategies.NetworkFirst({
            cacheName: "js-cache"
        })
    );

    // css files
    workbox.routing.registerRoute(
        /\.(?:css)\?id=.*$/,
        new workbox.strategies.NetworkFirst({
            cacheName: "css-cache"
        })
    );

    // image files
    workbox.routing.registerRoute(
        new RegExp(".+(?:jpg|jpeg|png|gif|svg)$"),
        new workbox.strategies.NetworkFirst({
            cacheName: "images-cache",
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
                })
            ]
        })
    );
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

const CACHE_NAME = 'offline-v1';
const urlsToCache = [
    './offline.html',
    './maintenance.html',
    './assets/logo.png',
    './assets/footer/contact/whatsapp.png',
    './assets/footer/contact/telegram.png',
    './assets/footer/contact/line.png',
    './json/swapi.json',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // event.respondWith(handleFetchRequest(event.request));
    const request = event.request;
    const url = new URL(request.url);

    // Define the domain you want to skip (e.g., example.com)
    const domainToSkip = ['d313lzv9559yp9.cloudfront.net','a.exoclick.com'];
    const hostname = url.hostname;
    const isInArray = domainToSkip.includes(hostname);    

    // Check if the request's URL matches the domain you want to skip
    if(isInArray){
        return;
    }else{
        event.respondWith(handleFetchRequest(request));
    }
});

async function handleFetchRequest(request) {
    if (!navigator.onLine) {
        // return caches.match('/offline.html');
        //Device Offline 
        // const offlineHtml = generateOfflineHtml();

        // return new Response(offlineHtml, {
        //     headers: { 
        //         'Content-Type': 'text/html' 
        //     }
        // });
    }

    try {
        const response = await fetch(request);
        // Domain Response Header (Server)
        const hostname = self.location.hostname;
        const requestURL = new URL(request.url);
        const requestURLHost = requestURL.hostname;

        if(response !== null || response){
            //Maintenance
            if (
                response.status === 521 ||
                response.status === 522 ||
                response.status === 523
            ) {
                return caches.match('/maintenance.html');
            }

            //Check Current Domain Only
            if (isDomainAllowed(requestURLHost, [hostname])) {
                if(response.ok){
                    const serverHeader = response.headers.get('server');
                    const serverCFRay = response.headers.get('Cf-Ray');
                    if (serverHeader) {
                        if (!serverHeader.includes('cloudflare') && !serverCFRay) {
                            // Do something specific when the 'Server' header contains not 'cloudflare'
                            const redirectResponse = new Response(
                                `<script>
                                let backupDomain = '';

                                if(localStorage.getItem('currency') == 'IDR'){
                                    backupDomain = 'https://number9indon6.com';
                                }

                                window.location.replace(backupDomain);
                                
                            </script>`,
                                {
                                    status: 200, // Status code indicating success
                                    statusText: 'OK',
                                    headers: {
                                    'Content-Type': 'text/html',
                                    'Cache-Control': 'no-store' 
                                    },
                                }
                            );
                            return redirectResponse;
                        }
                    }
                }
            }
        }else{
            return caches.match('/offline.html');
        }
        // Try to fetch the requested resource from the network
        // return await fetch(request);
        return response;
    } catch (error) {
        // if (error.message.includes('Failed to fetch')) {
            return caches.match('/offline.html');
        // }
        // Network request failed, respond with a custom error response
        // return new Response('Network request failed', {
        //     status: 500,
        //     statusText: 'Network Error'
        // });
    }
}

function isDomainAllowed(requestHostname, allowedDomains) {
    // Check if the request hostname (domain) is in the list of allowed domains
    return allowedDomains.includes(requestHostname);
}