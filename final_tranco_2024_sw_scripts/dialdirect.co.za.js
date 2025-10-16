const staticCacheName = 'dial-static-cache-2024-11-14';//Remeber to change this when making changes to other pages
//Store the request URLS
const assets = [
    "/",
    "/contact-us/",
    "/login/",
    "/login/?returnurl=/dashboard",
    "/app/dialdirect-driving-app/",
    "/claims/",
    "/products/",
    "/benefits/",
    "/products/vehicle/car-insurance/"
];

//Log offline occurrences
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');
if (workbox) {
    console.log("Workbox is loaded");
    workbox.googleAnalytics.initialize({
        parameterOverrides: {
            cd1: "offline"
        },
        hitFilter: (params) => {
            const queueTimeInSeconds = Math.round(params.get("qt") / 1000);
            params.set("cm1", queueTimeInSeconds);
        }
    });
}

// install event
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    return false;
});