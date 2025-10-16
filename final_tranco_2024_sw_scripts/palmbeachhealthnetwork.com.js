//Palm Beach Health Network
//Palm Beach Health Network
//6d14fbd9-9bba-4562-ac93-69f8c15b2c3b


//Workbox12
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.setConfig({
    debug: false  //set to true for debugging purpose
});

const { precaching } = workbox.precaching;
const { BackgroundSyncPlugin } = workbox.backgroundSync;
const { registerRoute, setDefaultHandler, setCatchHandler } = workbox.routing;
const { NetworkFirst, CacheFirst, StaleWhileRevalidate, NetworkOnly } = workbox.strategies;
const { cacheNames } = workbox.core;
const { precacheAndRoute, PrecacheController, matchPrecache } = workbox.precaching;

const OfflineURL = '/pwa/index';


//Set hospital specific values

var db = '';
var serviceURLdomain = 'service-prep.tenethealth.com';
var ceDB = 'TenetDB5';
var fapConfig = 'DEL,GSM,SMH,PBG,WBO,SMH-2,';
var tprSite = 'false';

let fapAPI = 'https://' + serviceURLdomain + '/api/Physician/FindAll?db=' + fapConfig + '&culture=en' + '&tprSite=' + tprSite;


//Setup Pre-cache https://developers.google.com/web/tools/workbox/modules/workbox-precaching
//const precacheController = new PrecacheController();
//precacheController.addToCacheList([
precacheAndRoute([


    { url: OfflineURL, revision: '14.4.8131.2841' },
    { url: fapAPI, revision: '20241126' },
    { url: '/assets/js/lib/vue.min.js', revision: '14.4.8131.2841' },
    { url: '/assets/CSS/bundle.min.css', revision: '14.4.8131.2841' },
    { url: '/assets/CSS/tailwind/AcuteCare/tailwind.min.css', revision: '14.4.8131.2841' },
    { url: '/assets/js/dist/physicianfinder/physicianfinder-min.js', revision: '14.4.8131.2841' },
    { url: '/assets/js/dist/ourlocations/ourlocations-min.js', revision: '14.4.8131.2841' },
    { url: '/assets/images/fap-photo-default.png', revision: '14.4.8131.2841' },
    { url: '/assets/Images/cta-transparent-image.png', revision: '14.4.8131.2841' },
    { url: '/en/api/WebUtility/TenetServiceURL', revision: '14.4.8131.2841' },
    { url: '/locations/GetFacilities', revision: '14.4.8131.2841' }
    ], {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/]
    },
    {
    cleanUrls: false // To disable: If a request fails to match the precache, serviceworker would try by adding .html to the end
    });

    if (workbox) {

    console.log('Workbox is loaded');

    //1. Exlusion list. The below files doesnt need any kind of Cache or offline behaviour
    const exclusionURLMatch = ({ url, event }) => {
    const isMatch = url.host === 'api.inquicker.com'
    || url.pathname.toLowerCase().startsWith('/sitefinity')
    || url.pathname.toLowerCase().indexOf('/action/edit') > -1
    || url.pathname.toLowerCase().startsWith('/appstatus')
    || url.pathname.toLowerCase().startsWith('/pwa/');
    return isMatch;
    };

    registerRoute(
    exclusionURLMatch,
    () => {
    //console.log("ExlusionURL is triggered");
    new NetworkOnly();
    }
    );

    //2. Javascript Files
    registerRoute(
    /\.js$/,
    new NetworkFirst()
    );

    //3. Stylesheet Files
    registerRoute(
    // Cache CSS files.
    /\.css$/,
    // Use cache but update in the background.
    new StaleWhileRevalidate({
    // Use a custom cache name.
    cacheName: 'css-cache'
    })
    );

    //4. Images
    registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif)/,
    new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
    new workbox.expiration.Plugin({
    // Only cache requests for a week
    maxAgeSeconds: 7 * 24 * 60 * 60,
    // Only cache 1000 requests.
    maxEntries: 1000
    }),
    new workbox.cacheableResponse.CacheableResponse({ statuses: [0, 200] }) //0 represents a opaque response
    ]
    })
    );

    //5. API calls (Need to be specific)
    //https://developers.google.com/web/tools/workbox/modules/workbox-routing
    //Incase of multiple regex, use a separate function to achieve it
    const matchAPI = ({ url, event }) => {
    return url.pathname === '//locations/GetFacilities'
    || url.host === serviceURLdomain;
    };

    registerRoute(
    //new RegExp('/api/PhysicianFinder/FindAll'),
    matchAPI,
    new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
    new workbox.cacheableResponse.CacheableResponse({
    statuses: [0, 200]
    //headers: {
    //    'X-Is-Cacheable': 'true'
    //},
    })
    ]
    })
    );


    //6. default route - Network First. If it fails, use cache. In case of error or offline(404), display offline page
    registerRoute(
    new RegExp('.*'),
    async ({ event }) => {
    const cacheKeyOfflinePage = workbox.precaching.getCacheKeyForURL(OfflineURL);
    try {
    //console.log(event.request);
    return await new NetworkFirst().handle({ event }).then((response) => {
    if (response.status === 404) {
    //since cachekey is cached by prefetch with revision value. The cache key becomes /pwa/index.html?__WB_REVISION__=1

    return caches.match(cacheKeyOfflinePage);
    }
    else {
    //console.log('Default route returned result');
    return response || caches.match(cacheKeyOfflinePage);
    }
    });
    } catch (error) {
    console.log(`Error handling: Load offline page` + error);
    return caches.match(cacheKeyOfflinePage);
    }
    }
    );

    } else {
    console.log(`Workbox didn't load`);
    }



    //Read this to understand its usage https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
    workbox.core.skipWaiting();  //to avoid skipwaiting and immediately install the new service worker version
    workbox.core.clientsClaim(); //Make even the current request to flow through the service worker
    