// @ts-check
/// <reference path="./catcher.d.ts" />
//@ts-ignore
// var mySelf = self;

var cacheName = 'stage-1';
var cache = caches.open( cacheName );
var postMsg = () => {
	// new Promise( ( res, rej ) => {
	console.log( "[Action] Start" );

	self.clients.matchAll().then( function ( clients ) {
		console.log( "Send active signal to each clients", clients );
		clients.forEach( function ( client ) {
			console.log( "Send active signal to client:", client );
			client.postMessage( 'Active signal' );
		} );
		// res( true );


	} );

}

var catchEvent =
	( obj ) =>
		( name, fnc ) =>
			() => {
				obj.addEventListener( name, fnc );
			}

self.addEventListener( 'install', ( evt ) => {

	// self.
	// evt.waitUntil( precache() );
	self.skipWaiting();
} );

self.addEventListener( 'activate', event => {
	event.waitUntil( clients.claim() );
} );

self.addEventListener( 'fetch', ( event ) => {
	if ( event.request.method != 'GET' ) return;
	// if ( event.request.htref)
	// console.log( event.request );
	const url = new URL( event.request.url, 'https://www.androidp1.com' );
	if ( url.origin !== 'https://www.androidp1.com' ) {
		return;
	}

	if ( event.request.destination !== 'script' && event.request.destination !== 'font' && event.request.destination !== 'style' ) {
		return;
	}
	//@ts-ignore
	event.respondWith( async function () {

		const cacheReady = await cache;
		var cachedResponse = await cacheReady.match( event.request );

		if ( !cachedResponse ) {
			var request = new Request( event.request.url, { mode: 'no-cors' } );
			if ( request ) {
				await cacheReady.add( request );
				cachedResponse = await cacheReady.match( request );
			}
		}


		// const cachedResponse = await cacheReady.match( event.request );

		// event.waitUntil( cacheReady.add( event.request ) );
		// return fetch( event.request.clone );;
		//@ts-ignore
		if ( !cachedResponse ) {
			cachedResponse = await fetch( event.request );;
		}
		return cachedResponse;

	}() );

	// evt.respondWith( fromCache( evt.request ) );
	//evt.waitUntil( update( evt.request ) );
} );

function precache() {
	return cache.then( function ( cache ) {


		return cache.addAll( [
			"https://www.prontoprint.com.ua/v2/wp-includes/js/jquery/jquery.js?ver=1.12.4-wp"
		] ).then( postMsg );

	} );
}


var fromCache = async ( request ) => {
	var cc = await cache;
	var matching = await cc.match( request );
	return matching;
}


function update( request ) {
	return cache.then( function ( cache ) {
		return fetch( request ).then( function ( response ) {
			return cache.put( request, response );
		} );
	} );
}


self.addEventListener( 'message', function ( event ) {

	if ( event.data.action === 'fetch' ) {
		cache.then( ( cache ) => {
			cache.keys( event.data.src ).then(
				( e ) => {
					if ( e.length === 0 ) {
						cache.add( event.data.src )
							.catch( () => {

								// console.log( "Error then put: ", event.data.src );
								event.source.postMessage( { 'fetchReady': true, 's': 2, 'src': event.data.src, 'el': event.data.el } );
							} ).then( () => {
								// console.log( "Put: ", event.data.src );
								event.source.postMessage( { 'fetchReady': true, 's': 1, 'src': event.data.src, 'el': event.data.el } );
							} );
					} else {
						// console.log( "Get: ", event.data.src );
						event.source.postMessage( { 'fetchReady': true, 's': 1, 'src': event.data.src, 'el': event.data.el } );
					}
				}
			);

		} );
		return;
	}


	// console.log( `[sw] REcive msg: `, event.data );
	event.source.postMessage( { 'fetchReady': false, 'msg': 'normal respond' } );
	evSource = event.source;


} );
