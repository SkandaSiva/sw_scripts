importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js");
importScripts("https://assets.emarsys.net/web-emarsys-sdk/4.5.0/web-emarsys-service-worker.js");

// when service worker is install, skipWaiting for new version
self.addEventListener("install", () => self.skipWaiting());

// Associated all pages with the Service Worker active
self.addEventListener('activate', () => self.clients.claim());

function getWebsiteTheme() {
    try {
        const websiteUrl = self.location.host;
        switch (true) {
            case (websiteUrl.includes('santediscount')) :
                return 'santediscount';
            case (websiteUrl.includes('atida')) :
                return 'atida';
            case (websiteUrl.includes('sanareva')) :
                return getSanarevaStore(websiteUrl);
            default :
                throw new Error('There is no website');
        }
    } catch (e) {
        throw new Error(`in service-worker -  getWebsiteTheme() : ${e}`);
    }
}

function getSanarevaStore(sanarevaUrl) {
    try {
        if (!sanarevaUrl) return new Error('missing sanarevaUrl parameter')
        switch (true) {
            case (sanarevaUrl.includes('.es')):
                return 'sanareva-es';
            case (sanarevaUrl.includes('.it')):
                return 'sanareva-it';
            case (sanarevaUrl.includes('.co.uk')):
                return 'sanareva-uk';
            default :
                throw new Error(`There is no Sanareva store for this url ${sanarevaUrl}`);
        }
    } catch (e) {
        throw new Error('in service-worker - getSanarevaStore():', e);
    }
}

if (workbox) {
    workbox.precaching.precacheAndRoute([{"revision":"5cc4ae7363cdc67cdc4a50bb516db2ad","url":"service-worker/atida/offline/index.html"},{"revision":"ef01c9bcd077b02372a4e01f27846ffe","url":"skin/frontend/atida/default/public/css/common.min.css"},{"revision":"c1d4eccbe24c597c9b81b4366e3f8854","url":"skin/frontend/base/default/public/css/service-worker.min.css"},{"revision":"9beedd5665a053a8c7c3c8a9af16d309","url":"service-worker/images/background.jpg"},{"revision":"8f27beec85374edf14ba218c598eec62","url":"service-worker/images/svg/icons.svg"}]);
    const website = getWebsiteTheme();
    self.addEventListener('fetch', (event) => {
        /** GET Document strategie */
        if ('document' === event.request.destination &&
            'GET' === event.request.method &&
            'navigate' === event.request.mode
        ) {
            event.respondWith(
                fetch(event.request)
                    .catch(() => {
                        return caches.match(`service-worker/${website}/offline/index.html`);
                    })
            );
        }
    });
}