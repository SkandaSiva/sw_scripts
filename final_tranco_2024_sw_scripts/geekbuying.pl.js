importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

    // workbox.precaching.precacheAndRoute([]);
    /*diyImg*/
    // const diyImgFunction = ({ url, event }) => {
    //     if (url.href.indexOf('https://www.geekbuying.pl') != -1 && (url.href.indexOf('.jpg') != -1 || url.href.indexOf('.gif') != -1 || url.href.indexOf('.png') != -1) 
    //         && (url.href.indexOf('https://www.geekbuying.pl/img/tronsmartTK09R/') >=0  
    //         ||url.href.indexOf('https://www.geekbuying.pl/img/tronsmartRadiant/') >=0 ||url.href.indexOf('https://www.geekbuying.pl/activity/') >=0)) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // };
    // workbox.routing.registerRoute(
    //     diyImgFunction,
    //     workbox.strategies.cacheFirst({
    //         cacheName: 'tronsmart-diyImg',
    //         plugins: [
    //             new workbox.expiration.Plugin({
    //                 maxEntries: 110,
    //                 maxAgeSeconds: 7 * 24 * 60 * 60, //7天
    //                 purgeOnQuotaError: true
    //             })
    //         ]
    //     })
    // );


    /*themeImg*/
    const themeImgFunction = ({ url, event }) => {
        if( url.href.indexOf('admin904b') ==-1){
            if (url.href.indexOf('https://www.geekbuying.pl') != -1 && (url.href.indexOf('.jpg') != -1 || url.href.indexOf('.gif') != -1 || url.href.indexOf('.png') != -1) 
                ) {
                return true;
            } else {
                return false;
            }
        }
    };
    workbox.routing.registerRoute(
        themeImgFunction,
        workbox.strategies.cacheFirst({
            cacheName: 'geekbuyingPl-themeImg',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 120,
                    maxAgeSeconds: 7 * 24 * 60 * 60, //7天
                    purgeOnQuotaError: true,
                })
            ]
        })
    );


    const matchCssFunction = ({ url, event }) => {
        if( url.href.indexOf('admin904b') ==-1){
            if (url.href.indexOf('https://www.geekbuying.pl') != -1 && url.href.indexOf('.css') != -1) {
                return true;
            } else {
                return false;
            }
        }
    };
    workbox.routing.registerRoute(
        matchCssFunction,
        workbox.strategies.cacheFirst({
            cacheName: 'geekbuyingPl-css',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 100,
                    purgeOnQuotaError: true
                })
            ]
        })
    );

    const matchJsFunction = ({ url, event }) => {
        if( url.href.indexOf('admin904b') ==-1){
            if (url.href.indexOf('https://www.geekbuying.pl') != -1 && url.href.indexOf('.js') != -1) {
                return true;
            } else {
                return false;
            }
        }
    };
    workbox.routing.registerRoute(
        matchJsFunction,
        workbox.strategies.cacheFirst({
            cacheName: 'geekbuyingPl-js',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 100,
                    purgeOnQuotaError: true
                })
            ]
        })
    );

    /*Font*/
    const matchFontFunction = ({ url, event }) => {
        if( url.href.indexOf('admin904b') ==-1){
            if ( (url.href.indexOf('.eot') != -1 || url.href.indexOf('.woff') != -1 || url.href.indexOf('.ttf') != -1 || url.href.indexOf('.svg') != -1)  ) {
                return true;
            } else {
                return false;
            }
        }
    };
    workbox.routing.registerRoute(
        matchFontFunction,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'geekbuyingPl-font',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 20,
                    purgeOnQuotaError: true
                })
            ]
        })
    );
