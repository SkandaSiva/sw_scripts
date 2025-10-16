


    class AggregatorBodyStrategy {
        /**
         * @param {Object} options
         */
        constructor(options = {}) {
            this.internalStrategy = options.internalStrategy;
            this.contentTypeAggregateResponse = options.contentTypeAggregateResponse;
            this.urls = options.urls;
        }

        /**
         * This method will perform a request strategy and follows an API that
         * will work with the
         * [Workbox Router]{@link workbox.routing.Router}.
         *
         * @param {Object} options
         * @param {Request} options.request The request to run this strategy for.
         * @param {Event} [options.event] The event that triggered the request.
         * @return {Promise<Response>}
         */
        async handle({
          event,
          request
        }) {
          return this.makeRequest({
            event,
            request: request || event.request
          });
        }

        /**
         * This method can be used to perform a make a standalone request outside the
         * context of the [Workbox Router]{@link workbox.routing.Router}.
         *
         * See "[Advanced Recipes](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#make-requests)"
         * for more usage information.
         *
         * @param {Object} options
         * @param {Request|string} options.request Either a
         *     [`Request`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Request}
         *     object, or a string URL, corresponding to the request to be made.
         * @param {FetchEvent} [options.event] If provided, `event.waitUntil()` will
         *     be called automatically to extend the service worker's lifetime.
         * @return {Promise<Response>}
         */
        async makeRequest({
          event,
          request
        }) {

            let response;
            let promises = [];
            let responses = [];
            let response_bodytext = [];
            let body_texts = [];

            // Make requests using the strategy.
            // Because we're passing in event, event.waitUntil() will be called automatically.
            for(let i=0; i<this.urls.length; i++){
                if( this.urls[i].active===true || (await this.urls[i].active(this.urls[i].cb_key))==='true' ){
                    promises.push( this.internalStrategy.handle({event, request: this.urls[i].url}) );
                }else{
                    continue;
                }
            }

            responses = await Promise.all(promises);

            for(let i=0; i<responses.length; i++){
                response_bodytext[i] = responses[i].text();
            }

            body_texts = await Promise.all(response_bodytext);

            // Assume that we just want to concatenate the responses to create the
            // final response HTML.
            let full_body = body_texts.join('\n');

            response = new Response(full_body, {
                headers: {'content-type': this.contentTypeAggregateResponse},
            });

            return response;
        }
    };



    const workbox_container = 'workbox-v4.1.0';
    const cache_prefix = 'bibbia-edu';
    const cache_suffix = 'wb_v4_3';

    //importScripts('https://storage.googleapis.com/workbox-cdn/releases/'+workbox_container+'/workbox-sw.js');
    importScripts('site/twig/templates/v3/assets/PWA/' + workbox_container + '/workbox-sw.js');
    importScripts('site/twig/templates/v3/assets/PWA/localforage-v1.7.3/localforage.js');
    


    if (workbox) {
        console.log(`Yay! Workbox is loaded 🎉`);

        workbox.setConfig({
            modulePathPrefix: 'site/twig/templates/v3/assets/PWA/' + workbox_container + '/'
        });

        workbox.core.setCacheNameDetails({
            prefix: cache_prefix,
            suffix: cache_suffix
        });


        self.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SKIP_WAITING') {
                console.log("About to skip waiting.");
                self.skipWaiting();
            }
        });

        //Cleaning Up Old Cache
        self.addEventListener('activate', function(event) {
          event.waitUntil(
            caches.keys().then(function(cacheNames) {
              return Promise.all(
                cacheNames.filter(function(cacheName) {
                  // Return true if you want to remove this cache,
                  // but remember that caches are shared across
                  // the whole origin
                  return ( !(new RegExp(`^${cache_prefix}.*${cache_suffix}$`)).test(cacheName) );
                }).map(function(cacheName) {
                  return caches.delete(cacheName);
                })
              );
            }).then(() => {
              console.log(`Cleaned UP old cache, ready handle fetches.🎉`);
            })
          );
        });

        //Cleaning Up Old Version(V3) Precached Data
        workbox.precaching.cleanupOutdatedCaches();
        const FALLBACK_ROUTES = 'no_cache_no_connection.html';
        //Pre-caching
        workbox.precaching.precacheAndRoute([
                {
                    url: FALLBACK_ROUTES,
                    revision: 'rev1',
                },
            ],
            {
                cleanUrls: false,
            }        
        );

        //precaching without workbox 'precaching' to follow routes policy of register route instead di precache builtins
        self.addEventListener('install', (event) => {
            let urls = [
                'site/twig/templates/v3/assets/css/main.css',
                'site/twig/templates/v3/assets/css/dark_mode_on.css',
                'site/twig/templates/v3/assets/css/dyslexia_mode_on.css',
            ];
            let cacheName = css_cache_storage;
            event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(urls)));
        });
        
        const FALLBACK_ROUTES_CACHE_KEY = workbox.precaching.getCacheKeyForURL(FALLBACK_ROUTES);
        // This "catch" handler is triggered when any of the other routes fail to
        // generate a response.
        workbox.routing.setCatchHandler(({event}) => {
            // The FALLBACK_URL entries must be added to the cache ahead of time, either via runtime
            // or precaching.
            // If they are precached, then call workbox.precaching.getCacheKeyForURL(FALLBACK_URL)
            // to get the correct cache key to pass in to caches.match().
            //
            // Use event, request, and url to figure out how to respond.
            // One approach would be to use request.destination, see
            // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
            
            //console.log('Routingcatchhandler event: ');
            //console.log(event);
            
            const url = event.request.url;
            switch (event.request.destination) {
    
                case 'document':
                    let fallback;
                    if( (new RegExp('/CEI2008(?:$|\/)')).test(url) || (new RegExp('/CEI1974(?:$|\/)')).test(url) || (new RegExp('/INTERCONFESSIONALE(?:$|\/)')).test(url) || (new RegExp('/EBRAICO(?:$|\/)')).test(url) || (new RegExp('/GRECO_LXX(?:$|\/)')).test(url) || (new RegExp('/GRECO_NT(?:$|\/)')).test(url) || (new RegExp('/NOVAVULGATA(?:$|\/)')).test(url) ){//Routes fallback
                        fallback = caches.match(FALLBACK_ROUTES_CACHE_KEY);
                    }else{//generic document fallback
                        fallback = Response.error();
                    }
                    return fallback;
                    break;
                
                case 'image':
                    //return caches.match(FALLBACK_IMAGE_URL);
                    //break;

                case 'font':
                    //return caches.match(FALLBACK_FONT_URL);
                    //break;

                default:
                    // If we don't have a fallback, just return an error response.
                    return Response.error();
            }
        });
        


        //Override default handler
        // Register 'default'
        const defaultStrategy = new workbox.strategies.StaleWhileRevalidate({
            cacheName: cache_prefix + '-' + 'default-cache' + '-' + cache_suffix,
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [200], // cut-out opague requests http 0
                }),
            ],
        });

        workbox.routing.setDefaultHandler(
            (args) => {
                if ( 'GET' === args.event.request.method ) {
                    return defaultStrategy.handle(args); // use default strategy
                }
                return fetch( args.event.request );
            }
        );

        workbox.routing.registerRoute(
            new RegExp('/admin/', 'i'),
            new workbox.strategies.NetworkOnly()
        );

        workbox.routing.registerRoute(
            new RegExp('/audio/', 'i'),
            new workbox.strategies.NetworkOnly()
        );

        workbox.routing.registerRoute(
            new RegExp('/api\/get\/[^\/]*\/status/', 'i'),
            new workbox.strategies.NetworkOnly()
        );

        workbox.routing.registerRoute(
            new RegExp('/api_v3\/.*/', 'i'),
            new workbox.strategies.NetworkOnly()
        );

        workbox.routing.registerRoute(
            new RegExp('/.*?phpm[a-z0-9]{1}ad[a-z0-9]{1}i[a-z0-9]{1}.*?/', 'i'),
            new workbox.strategies.NetworkOnly()
        );

        //Routes' handlers
        workbox.routing.registerRoute(
            new RegExp('/CEI2008(?:$|\/)'),
            new workbox.strategies.StaleWhileRevalidate({
                cacheName: cache_prefix + '-' + 'routes-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ],
            })
        );
        workbox.routing.registerRoute(
            new RegExp('/CEI1974(?:$|\/)'),
            new workbox.strategies.StaleWhileRevalidate({
                cacheName: cache_prefix + '-' + 'routes-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ],
            })
        );
        workbox.routing.registerRoute(
            new RegExp('/INTERCONFESSIONALE(?:$|\/)'),
            new workbox.strategies.StaleWhileRevalidate({
                cacheName: cache_prefix + '-' + 'routes-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ],
            })
        );
        workbox.routing.registerRoute(
            new RegExp('/EBRAICO(?:$|\/)'),
            new workbox.strategies.StaleWhileRevalidate({
                cacheName: cache_prefix + '-' + 'routes-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ],
            })
        );
        workbox.routing.registerRoute(
            new RegExp('/GRECO_LXX(?:$|\/)'),
            new workbox.strategies.StaleWhileRevalidate({
                cacheName: cache_prefix + '-' + 'routes-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ],
            })
        );
        workbox.routing.registerRoute(
            new RegExp('/GRECO_NT(?:$|\/)'),
            new workbox.strategies.StaleWhileRevalidate({
                cacheName: cache_prefix + '-' + 'routes-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ],
            })
        );
        workbox.routing.registerRoute(
            new RegExp('/NOVAVULGATA(?:$|\/)'),
            new workbox.strategies.StaleWhileRevalidate({
                cacheName: cache_prefix + '-' + 'routes-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ],
            })
        );



        let css_cache_storage = cache_prefix + '-' + 'css-cache' + '-' + cache_suffix;

        workbox.routing.registerRoute(
            // Cache CSS files
            new RegExp(/main.css/, 'i'),
            // Use cache but update in the background ASAP
            //main_css_handler
            new AggregatorBodyStrategy({
                internalStrategy: new workbox.strategies.StaleWhileRevalidate({cacheName: css_cache_storage}),
                contentTypeAggregateResponse: 'text/css',
                urls: [
                    {url: 'site/twig/templates/v3/assets/css/main.css', active: true},
                    {url: 'site/twig/templates/v3/assets/css/dark_mode_on.css', active: localforage.getItem, cb_key: 'dark_on'},
                    {url: 'site/twig/templates/v3/assets/css/dyslexia_mode_on.css', active: localforage.getItem, cb_key: 'dyslexia_on'},
                ],
            })    
            
        );


        workbox.routing.registerRoute(
            // Cache CSS files
            new RegExp(/.*\.css/, 'i'),
            //new RegExp(/.*(?<!main)\.css/, 'i'), //gstisco il main.css con un fetch personalizzato
            // Use cache but update in the background ASAP
            new workbox.strategies.StaleWhileRevalidate({
                // Use a custom cache name
                cacheName: css_cache_storage,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200], // cutout opague requests
                    }),
                ]
            })
        );

        workbox.routing.registerRoute(
            // Cache js and module js files
            new RegExp(/.*\.(?:js|mjs)/, 'i'),
            // Use cache but update in the background ASAP
            new workbox.strategies.StaleWhileRevalidate({
                // Use a custom cache name
                cacheName: cache_prefix + '-' + 'js-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ]
            })
        );

        workbox.routing.registerRoute(
            // Cache html,htm files
            new RegExp(/.*\.htm(?:l){0,1}/, 'i'),
            // Use cache but update in the background ASAP
            new workbox.strategies.StaleWhileRevalidate({
                // Use a custom cache name
                cacheName: cache_prefix + '-' + 'html-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ]
            })
        );


        //Asynchronous call caching
        workbox.routing.registerRoute(
            new RegExp(/ajax\.php/, 'i'),
            new workbox.strategies.NetworkFirst({
                cacheName: cache_prefix + '-' + 'async-call' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ],
            }),
        );
        /*
         workbox.routing.registerRoute(
         new RegExp(/ajax\.php/, 'i'),
         ({url, event}) => {
         return caches.open(cache_prefix + '-' + 'async-call' + '-' + cache_suffix).then((cache) => {
         console.log("Eccolo");
         const customRequest = `${url.origin}${url.pathname}`;
         console.log("UrlOrigin: "+url.origin+", UrlPathname: "+url.pathname);
         return cache.match(customRequest).then((cacheRes) => {
         if (cacheRes) {
         return cacheRes;
         }
         return fetch(event.request).then((fetchRes) => {
         cache.put(customRequest, fetchRes.clone());
         return fetchRes;
         });
         });
         });
         }
         );*/

                //Service worker stuff
        workbox.routing.registerRoute(
            new RegExp(/service-worker\.php/, 'i'),
            new workbox.strategies.NetworkFirst({
                cacheName: cache_prefix + '-' + 'service-worker' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ],
            }),
        );

        workbox.routing.registerRoute(
            // Cache php files
            new RegExp(/.*\.php/, 'i'),
            // Use cache but update in the background ASAP
            new workbox.strategies.StaleWhileRevalidate({
                // Use a custom cache name
                cacheName: cache_prefix + '-' + 'php-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ]
            })
        );

        workbox.routing.registerRoute(
            // Cache image files
            new RegExp(/.*\.(?:png|jpg|jpeg|svg|gif|bmp|ico)/, 'i'),
            // Use the cache if it's available
            new workbox.strategies.CacheFirst({
                // Use a custom cache name
                cacheName: cache_prefix + '-' + 'image-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.expiration.Plugin({
                        // Cache only 20 images
                        //maxEntries: 20,
                        // Cache for a maximum of a week
                        maxAgeSeconds: 7 * 24 * 60 * 60,
                    }),
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ],
            })
        );

        workbox.routing.registerRoute(
            // Cache fonts files
            new RegExp(/.*\.(?:woff2|ttf)/, 'i'),
            // Use the cache if it's available
            new workbox.strategies.CacheFirst({
                // Use a custom cache name
                cacheName: cache_prefix + '-' + 'fonts-cache' + '-' + cache_suffix,
                plugins: [
                    new workbox.expiration.Plugin({
                        // Cache only 20 images
                        //maxEntries: 20,
                        // Cache for a maximum of a week
                        maxAgeSeconds: 7 * 24 * 60 * 60,
                    }),
                    new workbox.cacheableResponse.Plugin({
                        statuses: [200] // cutout opague requests
                    }),
                ],
            })
        );


/*
        self.addEventListener('push', (event) => {
            const title = 'Message from BibbiaEDU';
            const options = {
                body: event.data.text(),
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                requireInteraction: true
            };
            event.waitUntil(self.registration.showNotification(title, options));
        });


                

         self.addEventListener('notificationclick', event => {
         const notification = event.notification;
         const action = event.action;

         if (action === 'dismiss') {
         notification.close();
         } else {
         // This handles both notification click and 'details' action,
         // because some platforms might not support actions.
         clients.openWindow(notification.data.href);
         notification.close();
         }
         });                

         */


    } else {
        console.log(`Boo! Workbox didn't load 😬`);
    }


