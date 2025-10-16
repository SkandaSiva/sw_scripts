//remember to increment the version # when you update the service worker
const version = "1.02",
    preCache = "PRECACHE-" + version,
    cacheList = [];

/*  Service Worker Event Handlers */
self.addEventListener( "install", function ( event ) {
    // console.log( "Installing the service worker!" );
    self.skipWaiting();
    caches.open( preCache )
        .then( cache => {
            cache.addAll( cacheList );
        } );
});

self.addEventListener( "activate", function ( event ) {
    event.waitUntil(
        //wholesale purge of previous version caches
        caches.keys().then( cacheNames => {
            cacheNames.forEach( value => {
                if ( value.indexOf( version ) < 0 ) {
                    caches.delete( value );
                }
            } );
            // console.log( "service worker activated" );
            return;
        })
    );
});
