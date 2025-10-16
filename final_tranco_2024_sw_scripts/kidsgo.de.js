var CACHE_NAME = 'interna_cache_v1';
var urlsToPrefetch = [ 
		'/js/lib/owl-carousel/assets/owl.carousel.min.css',
        '/js/lib/owl-carousel/assets/owl.theme.default.min.css',
        '/js/lib/require.js', 
        ];

self.addEventListener( 'install', function( event ) {
	self.skipWaiting();
	event.waitUntil( caches.open( CACHE_NAME ).then( function( cache ) {
		try {
			return cache.addAll( urlsToPrefetch );
		} catch ( e ) {
			console.log( e )
		}
	} ) );

} );
