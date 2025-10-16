const staticCacheName = 'site-static';
const dynamicCacheName = 'site-dynamic';

const offlineCallbackUrl = "/offline.html";
const offlineCallbackImage = '/images/OfflinePicture.svg';

const assets = [
    '/',
    '/Resources/Styles/style-new.css',
    '/Pages/Account/SignIn/SignIn.css',
    '/Pages/Account/SignIn/SignIn.js',
    '/Controls/Navigations/PublicNav/PublicNav.css',
    '/Controls/Navigations/PublicNav/PublicNav.js',
    '/Controls/Navigations/LangSwitch/LangSwitch.css',
    '/Controls/Navigations/LangSwitch/LangSwitch.js',
    '/Controls/Form/PasswordFormItem/PasswordFormItem.css',
    '/Controls/Form/PasswordFormItem/PasswordFormItem.js',
    '/Controls/UI/Tooltip/Tooltip.css',
    '/Controls/UI/Tooltip/Tooltip.js',
    '/Controls/Icons/Icon/Icon.css',
    '/Controls/Icons/Icon/Icon.js',
    '/Controls/Layout/Footer/Footer.css',
    '/Controls/Layout/Footer/Footer.js',
    '/Pages/Public/Login/Login.css',
    '/Pages/Public/Login/Login.js',
    '/Resources/Scripts/Scripts.js',
    '/Controls/PostBackHandlers/PostBackHandlers.js',
    '/images/Favicons/apple-touch-icon.png',
    '/images/Favicons/favicon-32x32.png',
    '/images/Favicons/favicon-16x16.png',
    '/images/Favicons/safari-pinned-tab.svg',
    '/images/Logos/rct-portal_logo.svg',
    '/images/Logos/rct-portal-logo-xmas.svg',
    '/images/Logos/rct-portal-logo-origin.svg',
    '/images/Logos/app-store.svg',
    '/images/Logos/google-play.svg',
    '/images/Icons/LangSwitch/english_flag.svg',
    '/images/Icons/LangSwitch/german_flag.svg',
    '/images/Icons/LangSwitch/czech_flag.svg',
    '/images/OfflinePicture.svg',
    './login-bg.jpg',
    './login-bg_768.jpg',
    './login-bg_1024.jpg',
    './login-bg_1200.jpg',
    './login-bg_1366.jpg',
    './login-bg_1440.jpg',
    './login-bg_920.jpg',
    '/loader.svg',
    '/RobotoCondensed-Bold.otf',
    '/RobotoCondensed-Bold.svg',
    '/RobotoCondensed-Bold.ttf',
    '/RobotoCondensed-Bold.woff',
    '/RobotoCondensed-Bold.woff2',
    '/RobotoCondensed-Light.otf',
    '/RobotoCondensed-Light.svg',
    '/RobotoCondensed-Light.ttf',
    '/RobotoCondensed-Light.woff',
    '/RobotoCondensed-Light.woff2',
    '/RobotoCondensed-Regular.otf',
    '/RobotoCondensed-Regular.svg',
    '/RobotoCondensed-Regular.ttf',
    '/RobotoCondensed-Regular.woff',
    '/RobotoCondensed-Regular.woff2',
    '/offline.html',
    '/manifest.json'
];

function install() {
    caches.open(staticCacheName).then(cache => {
        console.log('caching assets');
        cache.addAll(assets);
    });
}

self.addEventListener('install', event => {
    event.waitUntil(install());
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

const fromOfflineFallback = (cache, request) => {
    if (request.destination === 'document') {
        return cache.match(offlineCallbackUrl);
    }
    else if (request.destination === 'image') {
        return cache.match(offlineCallbackImage);
    }
}

const fromNetwork = (request, timeout) =>
    new Promise((fulfill, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(request).then(response => {
            clearTimeout(timeoutId);
            fulfill(response);
            try {
                if (request.method === 'GET'
                    && !request.url.startsWith('chrome-extension://')
                    && response.type !== 'opaque') {
                    updateCache(request, response.clone());
                }
            } catch (e) {
                // if cash update fails we dont want the whole fetch to fail
            }
        }, reject);
    });

const fromCache = request =>
    caches.open(staticCacheName)
        .then(cache => cache
            .match(request)
            .then(matching => matching || fromOfflineFallback(cache, request)));

const updateCache = (request, response) =>
    caches.open(staticCacheName)
        .then(cache => cache.put(request, response));

self.addEventListener('fetch', event => {
    let timeout;
    const url = event?.request?.url || '';
    if (url.indexOf("/chart/power-report/") > -1 || url.indexOf("/chart/power-stats/") > -1) {
        // extend timeout for power charts
        timeout = 30000;
    } else {
        timeout = 10000;
    }
    event.respondWith(fromNetwork(event.request, timeout)
        .catch(() => fromCache(event.request)));
});