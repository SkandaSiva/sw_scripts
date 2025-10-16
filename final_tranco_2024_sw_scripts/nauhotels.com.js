'use strict';
importScripts('sw-analytics.js');
self.analytics.trackingId = 'G-3SCNHNNPBF';

try {

    /* Replace below code with current site start*/


// 86acbd31cd7c09cf30acb66d2fbedc91daa48b86:1594362511.2451456
importScripts('https://aswpsdkus.com/notify/v2/ua-sdk.min.js')
uaSetup.worker(self, {
  
  defaultIcon: 'https://assets.milestoneinternet.com/highgate\u002Dhotels/nau\u002Dhotels/siteimages/pwa/nauhotels\u002D192.jpg',
  defaultTitle: 'NAU Hotels \u0026 Resorts',
  defaultActionURL: 'https://www.nauhotels.com/',
  appKey: 'JK2cd6MHQFWIvbH2kEGYOg',
  token: 'MTpKSzJjZDZNSFFGV0l2Ykgya0VHWU9nOlBOVkNIQnZhbkNTdFh0MEFfQUM1b1B0U2V1NnJMUWh6WGFndVA4bWZBWnc',
  vapidPublicKey: 'BMP3VqrjNeSgLdRrTYXhiPwuajqQkKcYFrlluv83D6on4W1fBohSy2VIc0xV6TrcsydhdoZ5QsKD6rFxDCd9bYs='
,workerUrl: 'https://www.nauhotels.com/serviceworker.js'})

    /* Replace below code with current site end*/
} catch (err) {
    /* console.log(err.message); */
}



var cacheName = 'nauhotelresortslanguagesites-202411271723545630';

var filesToCache = [
'./',
'./offline',
'./dynamic/css/without-banner.aspx',
'./dynamic/js/without-banner.aspx',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/nau-hotel-resorts-logo-brand-colored-2.svg',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/awards/logo-save-water-algarve-nau-hotels.png',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/ctp-logo.png',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/ahp-logo.jpg',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/lisbon-logo.jpg',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/algarve-logo.jpg',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/apal-logo.jpg',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/turismo-logo.jpg',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/red-flag.jpg',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/cnig-logo.jpg',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/lagto-logo.jpg',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/clean-safety-logo.png',
'https://assets.milestoneinternet.com/highgate-hotels/nau-hotels/siteimages/atrpin.svg'

];

var siteURL = "https://www.nauhotels.com/";
/* Install Service Worker*/
self.addEventListener('install', function (event) {

    event.waitUntil(
        /* Open the Cache*/
        caches.open(cacheName).then(function (cache) {
            /* Add Files to the Cache*/
            return cache.addAll(filesToCache);
        })
    );
});


/* Fired when the Service Worker starts up*/
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();

});


self.addEventListener('fetch', function (event) {
    // bypass cache for specific routes
    if (/\/cms7\//.test(event.request.url) || /IsDraftPage=true/.test(event.request.url) || /reqsrc=clientlogin/.test(event.request.url) || /ccadmin\/cms/.test(event.request.url) || /googletagmanager/.test(event.request.url) || /content_editor/.test(event.request.url) || /api/.test(event.request.url) || /recaptcha/.test(event.request.url) || /.pdf/.test(event.request.url) || /weatherwidgethandler.ashx/.test(event.request.url) || /events/.test(event.request.url) || /serviceworker.js/.test(event.request.url)) {}
    else {
         // bypass cache for all post requests
        if (event.request.method === 'POST') {
            return;
        }
         // fetch cache-first for all resource types and external urls, fetch from cache if no network
        if (navigator.onLine==false ||  event.request.url.indexOf(siteURL) == -1 || /.ico/.test(event.request.url) || /.woff/.test(event.request.url) || /.woff2/.test(event.request.url) || /.svg/.test(event.request.url) || /.png/.test(event.request.url) || /.bmp/.test(event.request.url) || /.jpeg/.test(event.request.url) || /.jpg/.test(event.request.url) || /.js/.test(event.request.url) || /.css/.test(event.request.url) || /.aspx/.test(event.request.url) || /.aspx/.test(event.request.url) || /\/image\//.test(event.request.url) || /\/images\//.test(event.request.url) || /\/images_noindex\//.test(event.request.url) || /\/resourcefiles\//.test(event.request.url) || /\/fonts\//.test(event.request.url)) {
            event.respondWith(
                caches.match(event.request)
                    .then(function (response) {
                        return response || fetchAndCache(event.request);
                    })
            );
        }         
        else {
            // fetch network-first for all the pages if no network serve from cache
            event.respondWith(
                fromNetwork(event.request).catch(() =>
                    caches.match(event.request)
                        .then(function (response) {
                            // server from cache
                            if (response != undefined) {
                                return response;
                            }
                            else {
                                // if cache not avaible during no network then show offline page
                                if (event.request.url.search("/amp") > -1) {
                                    return caches.match('amp/offline');
                                }

                                return caches.match('offline');
                            }

                        })
                )
            );
        }
    }
});

// fetch the resource from the network
const fromNetwork = (request) =>
    new Promise((fulfill, reject) => {
        fetch(request).then(response => {
            var res = response.clone();
            fulfill(response);
            if (!response.type == 'basic') {
                throw Error(response.statusText);
            }
            // caching the response for next request
            caches.open(cacheName)
                .then(function (cache) {
                    cache.put(request, res);
                });
        }, reject);
    });

function fetchAndCache(url) {
    return fetch(url)
        .then(function (response) {
            /* Check if we received a valid response*/

            if (!response.type == 'basic') {
                throw Error(response.statusText);
            }
            return caches.open(cacheName)
                .then(function (cache) {
                    cache.put(url, response.clone());
                    return response;
                });
        })
        .catch(function (error) {

            // var checkstring1 = window.location.pathname;
            if (url.url.search("/amp") > -1) {
                return caches.match('amp/offline');

            }

            return caches.match('offline');

        });
}

self.addEventListener('push', function (event) {

    self.analytics.trackEvent('pushmessage-received');
});


self.addEventListener('notificationclick', function (event) {

    event.notification.close();
    var notification = event.notification;
    var rc_data = event.notification.data;
    /*  console.log(JSON.stringify(rc_data));*/

    var tk = rc_data.channel_id;
    var msgid = rc_data.data.extras.msgid;
    var key1 = Object.keys(rc_data.action)[0];
    var url = rc_data.action[key1];
    var currentdate = encodeURIComponent(new Date());

    fetch('https://www.nauhotels.com/api/PushNotificationApi/notificationviewed?msgid=' + msgid + '&tokn=' + tk + '&cdate=' + currentdate).then(function (response) {
        if (response.status !== 200) {

            throw new Error();
        }
    })

    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        /* Firefox no action*/

        event.waitUntil(
            Promise.all([
		self.analytics.trackEvent('pushmessage-clicked')
		])
        );
    } else {
        event.waitUntil(
            Promise.all([
		clients.openWindow(url),
		self.analytics.trackEvent('pushmessage-clicked')
		])
        );
    }





});




self.addEventListener('notificationclose', function (event) {
    event.notification.close();

});
