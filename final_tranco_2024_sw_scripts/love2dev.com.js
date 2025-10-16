importScripts( "js/7c7b7abf21bb15d030f9f30667b01f2d.min.js",
    "js/d8f2e54453516f37ae43341b1690dad0.min.js" );

class ResponseManager {

    isResponseCacheable( response ) {

        //only cache good responses
        //200 - Good :)
        // 0  - Good, but CORS. 
        //This is for Cross Origin opaque requests

        return [ 0, 200 ].includes( response.status );

    }

    isResponseNotFound( response ) {

        return response.status === 404;

    }

    fetchText( url ) {

        return fetch( url )
            .then( response => {

                if ( response.ok ) {

                    return response.text();

                }

            } );

    }

    fetchJSON( url ) {

        return fetch( url )
            .then( response => {

                if ( response.ok ) {

                    return response.json();

                }

            } );

    }

    /*
        This will fetch an app shell, page and data template
        It then uses Mustache to render everything together

        {
            request: //the request that triggered the fetch
            pageURL: "url to core page html",
            template: "url to the data template",
            api: //a method to execute that makes the API call,
            cacheName: "cache name to save the rendered response"
        }
    */
    fetchAndRenderResponseCache( options ) {

        let _self = this;

        return _self.fetchText( options.pageURL )
            .then( pageHTML => {

                return _self.fetchText( options.template )
                    .then( template => {

                        return pageHTML.replace( /<%template%>/g, template );

                    } );

            } )
            .then( pageTemplate => {

                return options.api( options.request )
                    .then( data => {

                        return Mustache.render( pageTemplate, data );

                    } );

            } ).then( html => {

                //make custom response
                let response = new Response( html, {
                        headers: {
                            'content-type': 'text/html'
                        }
                    } ),
                    copy = response.clone();

                caches.open( options.cacheName )
                    .then( cache => {
                        cache.put( options.request, copy );
                    } );

                return response;

            } );

    }

    cacheFallingBackToNetwork( request, cacheName ) {

        var responseManager = this;

        return caches.match( request )
            .then( response => {

                return response || fetch( request );

            } );
    }

    cacheFallingBackToNetworkCache( request, cacheName ) {

        var responseManager = this;

        return caches.match( request )
            .then( response => {

                if ( response ) {

                    return response;

                } else {

                    return fetch( request )
                        .then( response => {

                            //don't cache a 404 because the URL may become 200, etc
                            //chrome-extension requests can't be cached
                            //0 & 200 are good responses that can be cached
                            if ( !responseManager.isResponseNotFound( response ) &&
                                request.method.toUpperCase() === "GET" &&
                                request.url.indexOf( "chrome-extension" ) === -1 &&
                                responseManager.isResponseCacheable( response ) ) {

                                let rsp = response.clone();

                                //cache response for the next time around
                                return caches.open( cacheName ).then( function ( cache ) {

                                    cache.put( request, rsp );

                                    return response;

                                } );

                            } else {

                                return response;

                            }

                        } );

                }

            } );

    }

    cacheOnly( request, cacheName ) {

        return caches.match( request );

    }

    networkOnly( request ) {

        return fetch( request );

    }

}

class PushManager {

    constructor() {

        this.registerPush();

    }

    registerPush() {

        var pm = this;

        self.addEventListener( "push", event => {
            pm.handlePush( event );
        } );

        pm.registerResponse();

    }

    handlePush( event ) {

        console.log( '[Service Worker] Push Received.' );
        // console.log( '[Service Worker] Data: ', event.data );
        // console.log( `[Service Worker] Push had this data: "${event.data.text()}"` );

        try {

            const data = event.data.text(),
                msg = JSON.parse( data );

            event.waitUntil( self.registration
                .showNotification( msg.message.title, msg.message ) );

        } catch ( e ) {
            console.log( 'invalid json - notification supressed' );
        }

    }

    registerResponse() {

        var that = this;

        self.addEventListener( 'notificationclick', event => {

            that.handleResponse( event );

        } );

    }

    handleResponse( event ) {

        console.log( '[Service Worker] Notification click Received. ${event}' );

        if ( event.action && this.validURL( event.action ) ) {

            clients.openWindow( event.action );

        }

        event.notification.close();

    }

    validURL( str ) {

        try {
            let url = new URL( str );

            return true;

        } catch ( error ) {
            return false;
        }

    }

}

class InvalidationManager {

    constructor( invalidationRules ) {

        this.invalidationRules = invalidationRules;
        this.lastCleanUpTime = 0;

        this.cacheCleanUp();
    }

    cacheCleanUp() {

        let dt = Date.now();

        if ( this.lastCleanUpTime < ( dt - 1800000 ) ) {

            let invMgr = this;

            invMgr.invalidationRules.forEach( ( value ) => {

                switch ( value.invalidationStrategy ) {

                    case "ttl":

                        invMgr.updateStaleEntries( value );

                        break;

                    case "maxItems":

                        invMgr.maxItems( value );

                        break;

                    default:
                        break;
                }

            } );

            this.lastCleanUpTime = dt;

        }

    }

    maxItems( options ) {

        self.caches.open( options.cacheName ).then( ( cache ) => {

            cache.keys().then( ( keys ) => {

                if ( keys.length > options.strategyOptions.max ) {

                    let purge = keys.length - options.strategyOptions.max;

                    for ( let i = 0; i < purge; i++ ) {
                        cache.delete( keys[ i ] );
                    }

                }

            } );

        } );

    }

    updateStaleEntries( rule ) {

        self.caches.open( rule.cacheName )
            .then( ( cache ) => {

                cache.keys().then( function ( keys ) {

                    keys.forEach( ( request, index, array ) => {

                        cache.match( request ).then( ( response ) => {

                            let date = new Date( response.headers.get( "date" ) ),
                                current = Date.now();

                            //300 === 5 minutes
                            //3600 === 1 Hour
                            //86400 === 1 day
                            //604800 === 1 week

                            if ( !DateManager.compareDates( current, DateManager.addSecondsToDate( date, 300 ) ) ) {

                                cache.add( request );

                            }

                        } );

                    } );

                } );

            } );

    }

    invalidateCache( cacheName ) {

        let invMgr = this;

        invMgr.invalidationRules.forEach( ( value ) => {

            if ( value.cacheName === cacheName ) {

                switch ( value.invalidationStrategy ) {

                    case "ttl":

                        invMgr.updateStaleEntries( value );

                        break;

                    case "maxItems":

                        invMgr.maxItems( value );

                        break;

                    default:
                        break;
                }

            }

        } );


    }

}

class DateManager {

    constructor() {}

    /*
        simple conversion function to ensure we have a valid date
        assuming this is within our service worker. Formats should be limited to
        undefined, Date (object), object, string and number.
    */
    static ensureDateType( value ) {

        //maybe switch to switch statement????

        if ( !value ) {
            return new Date();
        }

        if ( Object.prototype.toString.call( value ) === "[object Date]" ) {
            return value;
        }

        //convert to date
        if ( typeof value === "object" ) {
            return new Date( value );
        }

        if ( typeof value === "string" ) {
            value = parseInt( value );
        }

        //assume the number is the number of seconds to live before becoming stale
        if ( typeof value === "number" ) {
            return new Date( Date.now() + value );
        }

        return value;

    }

    /*
        data comparison function
        calls ensureDateType for each date value
        returns is the first date value is less than the second date value
        in the context of the service worker we are looking for a TTL (1st value) to be less than
        the current time. If so then the logic should trigger an update
    */
    static compareDates( date1, date2 ) {

        date1 = this.ensureDateType( date1 );
        date2 = this.ensureDateType( date2 );

        return ( date1 < date2 );

    }


    static addSecondsToDate( t, seconds ) {

        return t.setSeconds( t.getSeconds() + seconds );

    }

}

//remember to increment the version # when you update the service worker
const version = "2.00",
    preCache = "PRECACHE-" + version,
    cacheList = [ "js/fb2bd939da6e8a018b9a3de6cfaf6d41.min.js",
        "js/76b102c3e946705073880f66426bcfe1.min.js",
        "js/f1d15bd9f3acda7b7963205829e05b3c.min.js",
        "js/4711e97da0be7c666c8ea1f578f22303.min.js",
        "js/92d040e62446db407dccaf089c1fa027.min.js",
        "js/5d22ac4b3740bcace16c72b9d4bde989.min.js",
        "js/3abe153bb83c0cfbb20fc15d694397ea.min.js",
        "offline/"
    ],
    love2devImages = "love2dev-images",
    love2devContent = "love2dev-content",
    responseManager = new ResponseManager( [ {
        "route": "/img\/|imgs\//",
        "cache": love2devImages
    } ] ),
    pushManager = new PushManager(),
    invalidationManager = new InvalidationManager( [ {
            "cacheName": preCache,
            "invalidationStrategy": "ttl",
            "strategyOptions": {
                "ttl": 604800 //1 week
            }
        },
        {
            "cacheName": love2devImages,
            "invalidationStrategy": "maxItems",
            "strategyOptions": {
                "max": 50,
                "ttl": 604800 //1 week
            }
        }
    ] ),
    routeRules = [ {
        "route": /img\/|imgs\//,
        "strategy": "cacheFallingBackToNetworkCache",
        "options": {
            cacheName: love2devImages
        },
        "cacheName": love2devImages
    }, {
        "route": /localhost\/|love2dev\//,
        "strategy": "cacheFallingBackToNetworkCache",
        "options": {
            cacheName: love2devContent
        },
        "cacheName": love2devContent
    } ];

function getCacheName( url ) {

    var cacheName = preCache;

    if ( /img\/|imgs\//.test( url ) ) {

        cacheName = love2devImages;

    }

    let u = new URL( url );

    if ( !cacheList.includes( u.pathname ) ) {

        cacheName = love2devContent;

    }

    return cacheName;

}

function testRequestRule( url, rules ) {

    for ( let i = 0; i < rules.length; i++ ) {

        if ( rules[ i ].route.test( url ) ) {
            return rules[ i ];
        }

    }

}

/*  Service Worker Event Handlers */

self.addEventListener( "install", function ( event ) {

    console.log( "Installing the service worker!" );

    self.skipWaiting();

    caches.open( preCache )
        .then( cache => {

            cacheList.forEach( url => {

                fetch( url ).then( function ( response ) {
                    if ( !response.ok ) {
                        throw new TypeError( 'bad response status - ' + response.url );
                    }
                    return cache.put( url, response );
                } );

            } );

            //            cache.addAll( cacheList );

        } );

} );

self.addEventListener( "activate", event => {

    event.waitUntil( async function () {
        // Feature-detect
        // if ( self.registration.navigationPreload ) {
        //     // Enable navigation preloads!
        //     await self.registration.navigationPreload.enable();
        // }

        //wholesale purge of previous version caches
        caches.keys().then( cacheNames => {
            cacheNames.forEach( value => {

                if ( value.indexOf( version ) < 0 ) {
                    caches.delete( value );
                }

            } );

            console.log( "service worker activated" );

            return;

        } )

    }() );

} );

self.addEventListener( "fetch", function ( event ) {

    event.respondWith(

        handleResponse( event )

        /* check the cache first, then hit the network */
        /*
                caches.match( event.request )
                .then( function ( response ) {

                    if ( response ) {
                        return response;
                    }

                    return fetch( event.request );
                } )
        */
    );

} );

function handleResponse( event ) {

    if ( event.request.method === 'GET' ) {

        if ( event.request.referrer && event.request.referrer !== "" ) {

            if ( new URL( event.request.url ).origin === location.origin ) {

                //cache then network
                let cacheName = getCacheName( event.request.url );

                let rule = testRequestRule( event.request.url, routeRules );

                rule = rule || {};

                switch ( rule.strategy ) {

                    case "cacheFallingBackToNetwork":

                        return responseManager
                            .cacheFallingBackToNetworkCache( event.request, cacheName );

                    case "fetchAndRenderResponseCache":

                        return responseManager.fetchAndRenderResponseCache( {
                                request: event.request,
                                pageURL: rule.options.pageURL,
                                template: rule.options.template,
                                api: rule.options.api,
                                cacheName: cacheName
                            } )
                            .then( response => {

                                invalidationManager.cacheCleanUp( cacheName );

                                return response;

                            } );

                    case "cacheOnly":

                        return responseManager.cacheOnly( event.request, cacheName )
                            .then( response => {

                                invalidationManager.cacheCleanUp( cacheName );

                                return response;

                            } );

                    case "networkOnly":

                        return responseManager.networkOnly( event.request );

                    default:

                        return responseManager.cacheFallingBackToNetworkCache( event.request, cacheName )
                            .then( response => {

                                invalidationManager.cacheCleanUp( cacheName );

                                return response;

                            } )
                            .catch( error => {
                                console.error( "fetch error: ", error );
                                console.error( "url: ", event.request.url );
                            } );

                }

            } else {
                return simpleFetch( event );
            }

        } else {
            return simpleFetch( event );
        }

    } else {
        return simpleFetch( event );
    }

}

function simpleFetch( event ) {

    //https://www.googleadservices.com
    //this is the request for the main document!
    return fetch( event.request )
        .catch( error => {

            if ( new URL( event.request.url ).origin === location.origin ) {

                console.error( "fetch error: ", error );
                console.error( "url: ", event.request.url );

                return caches.match( "offline/" );

            }

        } );

}

/* service worker resources

https: //love2dev.com/blog/what-is-the-service-worker-cache-storage-limit/
https: //love2dev.com/blog/service-worker-cache/

*/