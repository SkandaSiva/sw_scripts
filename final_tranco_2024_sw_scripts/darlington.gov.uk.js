"use strict";

const version = "V2.0.1";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.0/workbox-sw.js');

workbox.googleAnalytics.initialize({
    parameterOverrides: {
        cd1: 'offline',
    },
    hitFilter: (params) => {
        const queueTimeInSeconds = Math.round(params.get('qt') / 1000);
        params.set('metric1', queueTimeInSeconds);
    },
});

const { registerRoute } = workbox.routing;
const { precacheAndRoute } = workbox.precaching;
const { NetworkFirst } = workbox.strategies;
const { StaleWhileRevalidate } = workbox.strategies;
const { CacheFirst } = workbox.strategies;

precacheAndRoute(
    [
        //{ url: '/pwa-home', revision: null },
        //{ url: '/pwa-home/bins', revision: null },
        //{ url: '/pwa-home/payments', revision: null },
        //{ url: '/pwa-home/roadworks', revision: null },
        //{ url: '/pwa-home/news', revision: null },
        //{ url: '/pwa-home/consultations', revision: null },
        //{ url: '/pwa-home/whats-on', revision: null },
        //{ url: '/pwa-home/whats-nearby', revision: null },
        ////{ url: '/pwa-home/vacancies', revision: null },
        //{ url: '/pwa-home/', revision: null },
        //{ url: '/pwa-home/bins/', revision: null },
        //{ url: '/pwa-home/payments/', revision: null },
        //{ url: '/pwa-home/roadworks/', revision: null },
        //{ url: '/pwa-home/news/', revision: null },
        //{ url: '/pwa-home/consultations/', revision: null },
        //{ url: '/pwa-home/whats-on/', revision: null },
        //{ url: '/pwa-home/whats-nearby/', revision: null },
        ////{ url: '/pwa-home/vacancies/', revision: null },
        //{ url: 'https://api.darlington.gov.uk/api/news/all', revision: null },
        //{ url: 'https://api.darlington.gov.uk/api/vacancies/all', revision: null },
        //{ url: '/apple-touch-icon-120x120-precomposed.png', revision: null },
        //{ url: '/apple-touch-icon-120x120.png', revision: null },
        //{ url: '/apple-touch-icon-152x152-precomposed.png', revision: null },
        //{ url: '/apple-touch-icon-152x152.png', revision: null },
        //{ url: '/apple-touch-icon-192x192.png', revision: null },
        //{ url: '/apple-touch-icon.png', revision: null },
        //{ url: '/bundles/scripts/core', revision: null },
        //{ url: '/bundles/css/core', revision: null },
        //{ url: '/Content/bootstrap-xlgrid.min.css', revision: null },
        //{ url: '/Content/bootstrap.min.css', revision: null },
        //{ url: '/Content/Bootstrap5-PWA/Arrow-Down-White.svg', revision: null },
        //{ url: '/Content/Bootstrap5-PWA/bootstrap-grid.min.css', revision: null },
        //{ url: '/Content/Bootstrap5-PWA/bootstrap-reboot.min.css', revision: null },
        //{ url: '/Content/Bootstrap5-PWA/bootstrap-utilities.min.css', revision: null },
        //{ url: '/Content/Bootstrap5-PWA/bootstrap.min.css', revision: null },
        //{ url: '/Content/font-awesome.min.css', revision: null },
        //{ url: '/Content/fullcalendar.min.css', revision: null },
        //{ url: '/Content/fullcalendar.print.min.css', revision: null },
        //{ url: '/Content/themes/base/images/ui-bg_flat_0_aaaaaa_40x100.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-bg_flat_75_ffffff_40x100.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-bg_glass_55_fbf9ee_1x400.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-bg_glass_65_ffffff_1x400.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-bg_glass_75_dadada_1x400.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-bg_glass_75_e6e6e6_1x400.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-bg_glass_95_fef1ec_1x400.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-bg_highlight-soft_75_cccccc_1x100.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-icons_222222_256x240.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-icons_2e83ff_256x240.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-icons_444444_256x240.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-icons_454545_256x240.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-icons_555555_256x240.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-icons_777620_256x240.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-icons_777777_256x240.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-icons_888888_256x240.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-icons_cc0000_256x240.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-icons_cd0a0a_256x240.png', revision: null },
        //{ url: '/Content/themes/base/images/ui-icons_ffffff_256x240.png', revision: null },
        //{ url: '/Content/themes/base/jquery-ui.min.css', revision: null },
        //{ url: '/css/bootstrap_override.css', revision: null },
        //{ url: '/css/Civica.css', revision: null },
        //{ url: '/css/HomePageV2.min.css', revision: null },
        //{ url: '/css/Jcrop/Jcrop.gif', revision: null },
        //{ url: '/css/Jcrop/jquery.Jcrop.min.css', revision: null },
        //{ url: '/css/jQuery_Override.min.css', revision: null },
        //{ url: '/css/ModernGov.css', revision: null },
        //{ url: '/css/MyDarlington.css', revision: null },
        //{ url: '/css/newNavbar.min.css', revision: null },
        //{ url: '/css/print.min.css', revision: null },
        //{ url: '/css/PWA.css', revision: null },
        //{ url: '/css/PWA.min.css', revision: null },
        //{ url: '/css/PWA_bootstrap_override.css', revision: null },
        //{ url: '/css/PWA_bootstrap_override.min.css', revision: null },
        //{ url: '/css/Verint.css', revision: null },
        //{ url: '/css/VerintFullCalendar.css', revision: null },
        //{ url: '/css/VerintPrint.css', revision: null },
        //{ url: '/css/Themes/custom-Green.min.css', revision: null },
        //{ url: '/css/Themes/custom-HighContrast.min.css', revision: null },
        //{ url: '/css/Themes/custom-Orange.min.css', revision: null },
        //{ url: '/css/Themes/custom-Red.min.css', revision: null },
        //{ url: '/css/W3C_Components/w3c_Dialog.min.css', revision: null },
        //{ url: '/css/W3C_Components/w3c_Tabs.min.css', revision: null },
        //{ url: '/dbc-logo-192x192.png', revision: null },
        //{ url: '/DBC-Square-Logo-512x512.png', revision: null },
        //{ url: '/fonts/fontawesome-webfont.eot', revision: null },
        //{ url: '/fonts/fontawesome-webfont.svg', revision: null },
        //{ url: '/fonts/fontawesome-webfont.ttf', revision: null },
        //{ url: '/fonts/fontawesome-webfont.woff', revision: null },
        //{ url: '/fonts/fontawesome-webfont.woff2', revision: null },
        //{ url: '/images/ajax-loader.gif', revision: null },
        //{ url: '/images/Bin-Large.png', revision: null },
        //{ url: '/images/Corona/Header_1200.png', revision: null },
        //{ url: '/images/Corona/Header_1600.png', revision: null },
        //{ url: '/images/Corona/Header_1920.png', revision: null },
        //{ url: '/images/Corona/Header_768.png', revision: null },
        //{ url: '/images/Corona/Header_992.png', revision: null },
        //{ url: '/images/Corona/Striped-side-007DA3.png', revision: null },
        //{ url: '/images/Corona/Striped-side-13627a.png', revision: null },
        //{ url: '/images/dbclogo_colour_header-01.png', revision: null },
        //{ url: '/images/dbclogo_white_header-01.png', revision: null },
        //{ url: '/images/Event_Icons/Business-Week-Logo-Small.png', revision: null },
        //{ url: '/images/Event_Icons/Childrens-Events-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Click-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Community-Events-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Culture-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Festival-of-Ingenuity-Icon-Small.png', revision: null },
        //{ url: '/images/Event_Icons/Head-of-Steam-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/HealthyDarlington-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/InvestInDarlington-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/Arts-and-Culture-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/Business-Week-Logo-Large.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/C-Young-People-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/Children-and-Young-People-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/Children-Centre-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/Community-Events-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/Festival-of-Ingenuity-Icon-Large.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/Fitness-and-Sport-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/Head-of-Steam-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/HealthyDarlington-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/InvestInDarlington-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/LetsGoTeesValley-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/Libraries-Icon.png', revision: null },
        //{ url: '/images/Event_Icons/Large_Icons/Local-Decisions-Icons.png', revision: null },
        //{ url: '/images/event_icons/large_icons/markets-and-shopping-icon.png', revision: null },
        //{ url: '/images/event_icons/large_icons/older-people-icon.png', revision: null },
        //{ url: '/images/event_icons/large_icons/policing-icon.png', revision: null },
        //{ url: '/images/event_icons/large_icons/public-icon-large.png', revision: null },
        //{ url: '/images/event_icons/large_icons/public.png', revision: null },
        //{ url: '/images/event_icons/letsgoteesvalley-small-icon.png', revision: null },
        //{ url: '/images/event_icons/libraries-icon.png', revision: null },
        //{ url: '/images/event_icons/local-decisions-icon.png', revision: null },
        //{ url: '/images/event_icons/older-people-icon.png', revision: null },
        //{ url: '/images/event_icons/police-icon.png', revision: null },
        //{ url: '/images/event_icons/public-icon-small.png', revision: null },
        //{ url: '/images/event_icons/shopping-icon.png', revision: null },
        //{ url: '/images/event_icons/sports-icon.png', revision: null },
        //{ url: '/images/Garden-Waste-Bin.png', revision: null },
        //{ url: '/images/HealthyDarlington/Bowling/Bowling-balls-400X200-Trans.gif', revision: null },
        //{ url: '/images/HealthyDarlington/Header_Logo-large.png', revision: null },
        //{ url: '/images/HealthyDarlington/Logo-Events.png', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/10k_Original.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/Bowling_Fade_01.png', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/Bowling_Fade.png', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/Deals.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/Gym_Fade.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/Gym_Original.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/IndoorSports_Fade.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/IndoorSports_Original.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/SoftPlay_Fade.png', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/SoftPlay_Original.png', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/SupportForMe_Fade.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/SupportForMe_Original.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/Swimming_Fade.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Dolphin/Swimming_Original.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Eastbourne/3G-Pitch.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Eastbourne/Athletics_Original.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Eastbourne/FitnessClasses_Original.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Eastbourne/Football_Original.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Eastbourne/Gym_Original.jpg', revision: null },
        //{ url: '/images/HealthyDarlington/Tiles_Eastbourne/Holiday-Programme.jpg', revision: null },
        //{ url: '/images/Home/Background-Image-2-lg.jpg', revision: null },
        //{ url: '/images/Home/Background-Image-2-md.jpg', revision: null },
        //{ url: '/images/Home/Background-Image-2-sm.jpg', revision: null },
        //{ url: '/images/Home/Background-Image-2-xl.jpg', revision: null },
        //{ url: '/images/Logos/Enjoy_Darlington-Logo.png', revision: null },
        //{ url: '/images/No-Pic.jpg', revision: null },
        //{ url: '/images/PWA/01-IOS-Install.png', revision: null },
        //{ url: '/images/PWA/02-IOS-Install.png', revision: null },
        //{ url: '/images/PWA/03-IOS-Install.png', revision: null },
        //{ url: '/images/Scheme-A-Final.jpg', revision: null },
        //{ url: '/images/Scheme-B-Final.jpg', revision: null },
        //{ url: '/images/ServiceWorker/badge.png', revision: null },
        //{ url: '/images/ServiceWorker/dbc-alert-icon.png', revision: null },
        //{ url: '/images/Watermark.png', revision: null },
        //{ url: '/maskable_icon_x384.png', revision: null },
        //{ url: '/PWA/Images/apple-icon-180.png ', revision: null },
        //{ url: '/PWA/Images/apple-splash-1125-2436.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-1136-640.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-1170-2532.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-1242-2208.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-1242-2688.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-1284-2778.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-1334-750.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-1536-2048.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-1620-2160.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-1668-2224.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-1668-2388.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-1792-828.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-2048-1536.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-2048-2732.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-2160-1620.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-2208-1242.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-2224-1668.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-2388-1668.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-2436-1125.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-2532-1170.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-2688-1242.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-2732-2048.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-2778-1284.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-640-1136.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-750-1334.jpg', revision: null },
        //{ url: '/PWA/Images/apple-splash-828-1792.jpg', revision: null },
        //{ url: '/PWA/Images/DBC_Logo.png', revision: null },
        //{ url: '/PWA/Images/manifest-icon-192.png', revision: null },
        //{ url: '/PWA/Images/manifest-icon-512.png', revision: null },
        //{ url: '/scripts/Bootstrap5-PWA/bootstrap.bundle.min.js', revision: null },
        //{ url: '/scripts/bootstrap-accessibility.min.js', revision: null },
        //{ url: '/scripts/bootstrap-strength-meter.min.js', revision: null },
        //{ url: '/scripts/bootstrap.min.js', revision: null },
        //{ url: '/scripts/cookie-functions.js', revision: null },
        //{ url: '/scripts/CookieConsent.js', revision: null },
        //{ url: '/scripts/dscountdown.min.js', revision: null },
        //{ url: '/scripts/Image-Resizer.min.js', revision: null },
        //{ url: '/scripts/Image-Resizer_PWA.min.js', revision: null },
        //{ url: '/scripts/jquery-3.5.1.min.js', revision: null },
        //{ url: '/scripts/jquery-ui-1.12.1.min.js', revision: null },
        //{ url: '/scripts/jquery.common.min.js', revision: null },
        //{ url: '/scripts/jquery.timepicker.min.js', revision: null },
        //{ url: '/scripts/jquery.validate.min.js', revision: null },
        //{ url: '/scripts/jquery.validate.unobtrusive.min.js', revision: null },
        //{ url: '/scripts/lazysizes.min.js', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-bg_diagonals-thick_90_eeeeee_40x40.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-bg_glass_100_e4f1fb_1x400.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-bg_glass_50_3baae3_1x400.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-bg_glass_80_d7ebf9_1x400.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-bg_highlight-hard_100_f2f5f7_1x100.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-bg_highlight-hard_70_000000_1x100.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-bg_highlight-soft_100_deedf7_1x100.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-bg_highlight-soft_25_ffef8f_1x100.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-icons_2694e8_256x240.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-icons_2e83ff_256x240.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-icons_3d80b3_256x240.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-icons_72a7cf_256x240.png', revision: null },
        //{ url: '/scripts/lib/cupertino/images/ui-icons_ffffff_256x240.png', revision: null },
        //{ url: '/scripts/lib/cupertino/jquery-ui.min.css', revision: null },
        //{ url: '/scripts/lib/jquery-ui.min.js', revision: null },
        //{ url: '/scripts/lib/jquery.min.js', revision: null },
        //{ url: '/scripts/lib/moment.min.js', revision: null },
        //{ url: '/scripts/localforage.min.js', revision: null },
        //{ url: '/scripts/moment-with-locales.min.js', revision: null },
        //{ url: '/scripts/moment.min.js', revision: null },
        //{ url: '/scripts/PageScripts/Common.min.js', revision: null },
        //{ url: '/scripts/PageScripts/DBCEvents.min.js', revision: null },
        //{ url: '/scripts/PageScripts/DBCForwardPlanArea.min.js', revision: null },
        //{ url: '/scripts/PageScripts/DBCGreenWasteCollection.min.js', revision: null },
        //{ url: '/scripts/PageScripts/DBCMaster.min.js', revision: null },
        //{ url: '/scripts/PageScripts/DBCMyDarlingtonAlerts.min.js', revision: null },
        //{ url: '/scripts/PageScripts/DBCMyDarlingtonProfile.min.js', revision: null },
        //{ url: '/scripts/PageScripts/DBCMyDarlingtonProfileQubica.min.js', revision: null },
        //{ url: '/scripts/PageScripts/DBCMyDarlingtonRegister.min.js', revision: null },
        //{ url: '/scripts/PageScripts/DBCRefuseAndRecycling.min.js', revision: null },
        //{ url: '/scripts/PageScripts/DBCRegistrarSearch.min.js', revision: null },
        //{ url: '/scripts/PageScripts/HealthyDarlingtonBowlingStartPage.min.js', revision: null },
        //{ url: '/scripts/password-score-options.min.js', revision: null },
        //{ url: '/scripts/password-score.min.js', revision: null },
        //{ url: '/scripts/pwa-install.js', revision: null },
        //{ url: '/scripts/SideNavbar/Scrollbar-main.min.js', revision: null },
        //{ url: '/scripts/W3C_Components/W3C_Dialog.min.js', revision: null },
        //{ url: '/scripts/W3C_Components/W3C_Tabs.min.js', revision: null },
    ],
    {
        cleanupOutdatedCaches: true
    }
);

// Cache page navigations (html) with a Network First strategy
registerRoute(
    // Check to see if the request is a navigation to a new page
    ({ request }) => request.mode === 'navigate',
    // Use a Network First caching strategy
    new NetworkFirst({
        // Put all cached files in a cache named 'pages'
        cacheName: 'pages',
        plugins: [
            // Ensure that only requests that result in a 200 status are cached
            new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    }),
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
    // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
    ({ request }) =>
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'worker',
    // Use a Stale While Revalidate caching strategy
    new StaleWhileRevalidate({
        // Put all cached files in a cache named 'assets'
        cacheName: 'assets',
        plugins: [
            // Ensure that only requests that result in a 200 status are cached
            new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    }),
);

// Cache images with a Cache First strategy
registerRoute(
    // Check to see if the request's destination is style for an image
    ({ request }) => request.destination === 'image',
    // Use a Cache First caching strategy
    new CacheFirst({
        // Put all cached files in a cache named 'images'
        cacheName: 'images',
        plugins: [
            // Ensure that only requests that result in a 200 status are cached
            new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
            // Don't cache more than 50 items, and expire them after 30 days
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
            }),
        ],
    }),
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com?family=Open+Sans:400,700,800&display=swap',
    new StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
    ({ url }) => url.origin === 'https://fonts.gstatic.com',
    new CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
            })
        ],
    })
);

self.addEventListener('push', function (event) {
    var pushData = event.data.text();

    //console.log('[Service Worker] Push Received.');
    //console.log(`[Service Worker] Push had this data: "${pushData}"`);

    const title = 'Message From Darlington Borough Council';
    const options = {
        body: pushData,
        icon: '/images/ServiceWorker/dbc-alert-icon.png',
        badge: '/images/ServiceWorker/badge.png'
    };

    const notificationPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificationPromise);
});

self.addEventListener("install", (event) => {
    /*console.log("From SW: Install Event", event);*/
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    /*console.log("From SW: Activate Event", event);*/

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
});