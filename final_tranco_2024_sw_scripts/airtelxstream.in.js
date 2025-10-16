// const XHR_VERBS = {
//     POST: 'POST',
//     GET: 'GET',
// };

// const CACHE_STRATEGIES = {
//     CACHE_FIRST: 'CACHE_FIRST',
//     NETWORK_FIRST: 'NETWORK_FIRST',
//     STALE_WHILE_REVALIDATE: 'STALE_WHILE_REVALIDATE',
// };

// const CACHE_NAME = {
//     HTML_CACHE: 'HTML_CACHE',
// };

// const CACHE_CONFIGS = {
//     CRITICAL_PRORITY: {
//         name: 'CRITICAL_PRIORITY',
//         expire: 60 * 30,
//     },
//     HIGH_PRIORITY: {
//         name: 'HIGH_PRIORITY',
//         expire: 60 * 60 * 1,
//     },
//     MEDIUM_PRIORITY: {
//         name: 'MEDIUM_PRIORITY',
//         expire: 60 * 60 * 2,
//     },
//     LOW_PRIORITY: {
//         name: 'LOW_PRIORITY',
//         expire: 60 * 60 * 4,
//     },
//     LIFE_TIME: {
//         name: 'LIFE_TIME',
//         expire: 60 * 60 * 24,
//     },
//     TWO_DAYS: {
//         name: 'TWO_DAYS',
//         expire: 60 * 60 * 24 * 2,
//     },
//     STALE_WHILE_REVALIDATE: {
//         name: 'STALE_WHILE_REVALIDATE',
//     },

// };

// // caching
// /* eslint-disable */
// const cachingGroup = [];
// // {
// //     url: 'app/v1/config/appConfig',
// //     priority: CACHE_CONFIGS.LOW_PRIORITY,
// //     regex: /.*(?:app\/v1\/config\/appConfig).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.CACHE_FIRST
// // },
// // {
// //     url: 'app/v1/config/theme',
// //     priority: CACHE_CONFIGS.STALE_WHILE_REVALIDATE,
// //     regex: /.*(?:app\/v1\/config\/theme).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
// // },
// // {
// //     url: 'login?appId=WEBcaching=true',
// //     priority: CACHE_CONFIGS.MEDIUM_PRIORITY,
// //     regex: /.*(?:user\/login\?appId=WEB\&caching=true).*$/g,
// //     method: XHR_VERBS.POST,
// //     strategy: CACHE_STRATEGIES.NETWORK_FIRST
// // },
// // {
// //     url: 'user/profile/userConfig?appId=',
// //     priority: CACHE_CONFIGS.MEDIUM_PRIORITY,
// //     regex: /.*(?:user\/profile\/userConfig\?appId=).*$/g,
// //     method: XHR_VERBS.POST,
// //     strategy: CACHE_STRATEGIES.NETWORK_FIRST
// // },
// // {
// //     url: 'content?id=EROSNOW_MOVIE_6353996&appId=WEB',
// //     priority: CACHE_CONFIGS.LIFE_TIME,
// //     regex: /.*(?:content\?id=).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.CACHE_FIRST
// // },
// // {
// //     url: 'app/v2/search/related',
// //     priority: CACHE_CONFIGS.LIFE_TIME,
// //     regex: /.*.(?:app\/v3\/search\/related\?contentId=).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.CACHE_FIRST
// // },
// // {
// //     url: 'app/v2/search/peopleRelated',
// //     priority: CACHE_CONFIGS.LIFE_TIME,
// //     regex: /.*.(?:app\/v2\/search\/peopleRelated).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.CACHE_FIRST
// // },
// // {
// //     url: 'app/v1/people',
// //     priority: CACHE_CONFIGS.LIFE_TIME,
// //     regex: /.*.(?:app\/v1\/people).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.CACHE_FIRST
// // },
// // {
// //     url: 'app/v1/package',
// //     priority: CACHE_CONFIGS.STALE_WHILE_REVALIDATE,
// //     regex: /.*.(?:app\/v1\/package\?id=).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE
// // },
// // {
// //     url: 'app/v1/page',
// //     priority: CACHE_CONFIGS.STALE_WHILE_REVALIDATE,
// //     regex: /.*.(?:layout\/v1\/page).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE
// // },
// // {
// //     url: 'app/v1/content/channels',
// //     priority: CACHE_CONFIGS.LIFE_TIME,
// //     regex: /.*.(?:app\/v1\/content\/channels\?mwTvPack=).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.CACHE_FIRST
// // },
// // {
// //     url: 'app/v1/content/epg',
// //     priority: CACHE_CONFIGS.MEDIUM_PRIORITY,
// //     regex: /.*.(?:app\/v1\/content\/epg\?mwTvPack=).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.NETWORK_FIRST
// // },
// // {
// //     url: 'app/v2/search/related',
// //     priority: CACHE_CONFIGS.LIFE_TIME,
// //     regex: /.*.(?:app\/v2\/search\/related\?contentId=).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.CACHE_FIRST
// // },
// // {
// //     url: 'app/v4/content',
// //     priority: CACHE_CONFIGS.MEDIUM_PRIORITY,
// //     regex: /.*.(?:app\/v4\/content).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.CACHE_FIRST
// // },
// // {
// //     url: 'app/v4/content',
// //     priority: CACHE_CONFIGS.MEDIUM_PRIORITY,
// //     regex: /.*.(?:app\/v4\/content).*$/g,
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.CACHE_FIRST
// // }

// const htmlCachingGroup = [{
//     cacheName: CACHE_NAME.HTML_CACHE,
//     priority: CACHE_CONFIGS.TWO_DAYS,
//     regex: /.*airtelxstream.in\/tv-shows$/g,                 //for tv show landing page
//     method: XHR_VERBS.GET,
//     strategy: CACHE_STRATEGIES.CACHE_FIRST
// },
// {
//     cacheName: CACHE_NAME.HTML_CACHE,
//     priority: CACHE_CONFIGS.TWO_DAYS,
//     regex: /.*airtelxstream.in\/tv-shows\/.*/g,             //for show level, season level and episode level page
//     method: XHR_VERBS.GET,
//     strategy: CACHE_STRATEGIES.CACHE_FIRST,
// },
// {
//     cacheName: CACHE_NAME.HTML_CACHE,
//     priority: CACHE_CONFIGS.TWO_DAYS,
//     regex: /.*airtelxstream.in\/movies$/g,                    //for movie landing page
//     method: XHR_VERBS.GET,
//     strategy: CACHE_STRATEGIES.CACHE_FIRST
// },
// {
//     cacheName: CACHE_NAME.HTML_CACHE,
//     priority: CACHE_CONFIGS.TWO_DAYS,
//     regex: /.*airtelxstream.in\/movies\/.*/g,                                 //movie page
//     method: XHR_VERBS.GET,
//     strategy: CACHE_STRATEGIES.CACHE_FIRST
// },
// {
//     cacheName: CACHE_NAME.HTML_CACHE,
//     priority: CACHE_CONFIGS.TWO_DAYS,
//     regex: /.*airtelxstream.in\/artist\/.*/g,                      //artist info page
//     method: XHR_VERBS.GET,
//     strategy: CACHE_STRATEGIES.CACHE_FIRST
// },
// {
//     cacheName: CACHE_NAME.HTML_CACHE,
//     priority: CACHE_CONFIGS.TWO_DAYS,
//     regex: /.*airtelxstream.in\/more/g,                           //setting icon clicked             
//     method: XHR_VERBS.GET,
//     strategy: CACHE_STRATEGIES.CACHE_FIRST
// },
// {
//     cacheName: CACHE_NAME.HTML_CACHE,
//     priority: CACHE_CONFIGS.TWO_DAYS,
//     regex: /.*airtelxstream.in\/more\/.*/g,                      //setting icon click       
//     method: XHR_VERBS.GET,
//     strategy: CACHE_STRATEGIES.CACHE_FIRST
// },
// {
//     cacheName: CACHE_NAME.HTML_CACHE,
//     priority: CACHE_CONFIGS.TWO_DAYS,
//     regex: /.*airtelxstream.in\/livetv-channels$/g,                //live tv landing page             
//     method: XHR_VERBS.GET,
//     strategy: CACHE_STRATEGIES.NETWORK_FIRST
// },
// {
//     cacheName: CACHE_NAME.HTML_CACHE,
//     priority: CACHE_CONFIGS.TWO_DAYS,
//     regex: /.*airtelxstream.in\/livetv-channels\/.*/g,                          //live tv channel, live tv movie, live tv show, catchup
//     method: XHR_VERBS.GET,
//     strategy: CACHE_STRATEGIES.NETWORK_FIRST
// },
// // {
// //     cacheName: CACHE_NAME.HTML_CACHE,
// //     priority: CACHE_CONFIGS.TWO_DAYS,
// //     regex: /.*airtelxstream.in\/[^\/]{0}$/g,                //home page
// //     method: XHR_VERBS.GET,
// //     strategy: CACHE_STRATEGIES.NETWORK_FIRST
// // },
// ]


// /* eslint-enable */

// if (typeof importScripts === 'function') {
//     importScripts(
//         'https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js',
//     );

//     if (workbox) {
//         workbox.setConfig({
//             debug: false,
//         });
//         /* injection point for manifest files.  */
//         workbox.precaching.precacheAndRoute([]);

//         htmlCachingGroup.forEach((data) => {
//             workbox.routing.registerRoute(data.regex,
//                 new workbox.strategies.NetworkFirst({
//                     cacheName: data.cacheName,
//                     plugins: [
//                         new workbox.cacheableResponse.Plugin({
//                             statuses: [
//                                 200,
//                             ],
//                         }),
//                         new workbox.expiration.Plugin({
//                             maxAgeSeconds: data.priority.expire,
//                             purgeOnQuotaError: true,
//                         }),
//                     ],
//                 }));
//         });


//         /* custom cache rules */
//         /* eslint-disable */
//         // workbox.routing.registerNavigationRoute('/index.html', {
//         //     blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
//         // });
//         /* eslint-enable */

//         // custom added start
//         // TODO: Do R&D to divide this file into multipal modules

//         // workbox.routing.registerRoute(/.*.(?:html).*$/, new workbox.strategies.NetworkFirst({
//         //     cacheName: 'html Cache'
//         // }), XHR_VERBS.GET);

//         // workbox.routing.registerRoute(/.*.(?:svg).*$/, workbox.strategies.cacheFirst({
//         //     cacheName: CACHE_CONFIGS.LIFE_TIME.name,
//         //     plugins: [
//         //         new workbox.cacheableResponse.Plugin({
//         //             statuses: [
//         //                 200,
//         //             ],
//         //         }),
//         //         new workbox.expiration.Plugin({
//         //             maxAgeSeconds: CACHE_CONFIGS.LIFE_TIME.expire,
//         //             purgeOnQuotaError: true,
//         //         }),
//         //     ],
//         // }), XHR_VERBS.GET);

//         // workbox.routing.registerRoute(/.*.(?:png|jpg|jpeg|).*$/, new workbox.strategies.NetworkFirst({
//         //     cacheName: CACHE_CONFIGS.LIFE_TIME.name,
//         //     plugins: [
//         //         new workbox.cacheableResponse.Plugin({
//         //             statuses: [
//         //                 200,
//         //             ],
//         //         }),
//         //         new workbox.expiration.Plugin({
//         //             maxAgeSeconds: CACHE_CONFIGS.LIFE_TIME.expire,
//         //             purgeOnQuotaError: true,
//         //         }),
//         //     ],
//         // }), XHR_VERBS.GET);

//         workbox.routing.registerRoute(/(.*(?:googleapis|gstatic)\.com\/.*)/g, workbox.strategies.staleWhileRevalidate({
//             cacheName: CACHE_CONFIGS.LIFE_TIME.name,
//             plugins: [
//                 new workbox.expiration.Plugin({
//                     maxEntries: 50,
//                     purgeOnQuotaError: true,
//                 }),
//             ],
//         }), XHR_VERBS.GET);


//         cachingGroup.map((data) => {
//             if (data.method === XHR_VERBS.GET) {
//                 const regexUrl = (data.regex !== null) ? data.regex : new RegExp(`.*(?:${data.url}).*$`);
//                 switch (data.strategy) {
//                     case CACHE_STRATEGIES.CACHE_FIRST:
//                         return workbox.routing.registerRoute(regexUrl, workbox.strategies.cacheFirst({
//                             cacheName: data.priority.name,
//                             plugins: [
//                                 new workbox.expiration.Plugin({
//                                     maxAgeSeconds: data.priority.expire,
//                                     purgeOnQuotaError: true,
//                                 }),
//                             ],
//                         }));
//                     case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
//                         return workbox.routing.registerRoute(regexUrl, workbox.strategies.staleWhileRevalidate({
//                             cacheName: data.priority.name,
//                             plugins: [
//                                 new workbox.expiration.Plugin({
//                                     maxEntries: 50,
//                                     purgeOnQuotaError: true,
//                                 }),
//                             ],
//                         }));
//                     case CACHE_STRATEGIES.NETWORK_FIRST:
//                         return workbox.routing.registerRoute(regexUrl, new workbox.strategies.NetworkFirst({
//                             cacheName: data.priority.name,
//                             plugins: [
//                                 new workbox.expiration.Plugin({
//                                     maxEntries: 50,
//                                     purgeOnQuotaError: true,
//                                 }),
//                             ],
//                         }));
//                     default:
//                         return null;
//                 }
//             }

//             return null;
//         });

//         const matchRegex = (url) => {
//             let data;
//             const matched = cachingGroup.find((element) => {
//                 if (element.method === XHR_VERBS.POST) {
//                     data = element;
//                     return url.match(element.regex);
//                 }

//                 return false;
//             });

//             return {
//                 matched,
//                 data,
//             };
//         };
//         /* eslint-disable  */
//         this.addEventListener('fetch', (event) => {
//             if (event.request.method === XHR_VERBS.POST) {
//                 const urlMatched = matchRegex(event.request.url);
//                 if (urlMatched.matched) {
//                     switch (urlMatched.data.strategy) {
//                         case CACHE_STRATEGIES.NETWORK_FIRST:

//                             const fetchRequest = event.request.clone();

//                             return event.respondWith(
//                                 caches.open(urlMatched.data.priority.name).then(cache => cache.match(event.request.url).then(response => fetch(fetchRequest).then((res) => {
//                                     cache.put(event.request.url, res.clone());
//                                     return res;
//                                 }).catch(err => response) || response)),
//                             );

//                         default:
//                             return event.respondWith(
//                                 caches.match(event.request.url).then(async (response) => {
//                                     const expirationManager = new workbox.expiration.CacheExpiration(
//                                         urlMatched.data.priority.name, {
//                                             maxAgeSeconds: urlMatched.data.priority.expire,
//                                             purgeOnQuotaError: true,
//                                         },
//                                     );

//                                     if (response) {
//                                         const isUrlExpired = await expirationManager.isURLExpired(event.request.url);

//                                         //    console.debug('=========expired==============  : ', isUrlExpired);
//                                         if (!isUrlExpired) {
//                                             //       console.debug('----------response matches to cache-----------------');
//                                             return response;
//                                         }

//                                         expirationManager.expireEntries();
//                                     }

//                                     const fetchRequest = event.request.clone();
//                                     return fetch(fetchRequest, {
//                                         mode: 'cors'
//                                     }).then((fetchResponse) => {
//                                         if (!fetchResponse || fetchResponse.status !== 200) {
//                                             //      console.error('problem in response');
//                                             return fetchResponse;
//                                         }
//                                         const responseToCache = fetchResponse.clone();
//                                         //    console.debug('------------caching started----------------');
//                                         caches.open(urlMatched.data.priority.name).then((cache) => {
//                                             cache.put(event.request.url, responseToCache);
//                                             expirationManager.updateTimestamp(event.request.url);
//                                         }).catch((err) => {
//                                             //       console.debug('bye');
//                                             //  console.debug('error is :', err);
//                                         });

//                                         //    console.debug('-------------caching ended------------------');
//                                         return fetchResponse;
//                                     }).catch((err) => {
//                                         console.error('err', err);
//                                     });
//                                 }),
//                             );
//                     }
//                 }
//             }
//         });

//         /* eslint-enable  */


//         // custom added end
//     }
//     else {
//         // console.debug('Workbox could not be loaded. No Offline support');
//     }
// }
// /* eslint-disable */
// self.addEventListener('install', (event) => {
//     self.skipWaiting();
// });
// self.addEventListener('activate', event => {
//     //  console.debug('Activating new service worker...');

//     const cacheWhitelist = [CACHE_CONFIGS.CRITICAL_PRORITY.name, CACHE_CONFIGS.HIGH_PRIORITY.name, CACHE_CONFIGS.LIFE_TIME.name, CACHE_CONFIGS.LOW_PRIORITY.name, CACHE_CONFIGS.MEDIUM_PRIORITY.name, CACHE_CONFIGS.STALE_WHILE_REVALIDATE.name];

//     event.waitUntil(
//         caches.keys().then(cacheNames => {
//             return Promise.all(
//                 cacheNames.map(cacheName => {
//                     if (cacheWhitelist.indexOf(cacheName) !== -1) {
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });
// /* eslint-enable */
