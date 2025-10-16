/* PWA v0.3.0-front */


/* Source wp-base-config: */
!function(){"use strict";try{self["workbox:sw:4.3.1"]&&_()}catch(t){}const t="https://storage.googleapis.com/workbox-cdn/releases/4.3.1",e={backgroundSync:"background-sync",broadcastUpdate:"broadcast-update",cacheableResponse:"cacheable-response",core:"core",expiration:"expiration",googleAnalytics:"offline-ga",navigationPreload:"navigation-preload",precaching:"precaching",rangeRequests:"range-requests",routing:"routing",strategies:"strategies",streams:"streams"};self.workbox=new class{constructor(){return this.v={},this.t={debug:"localhost"===self.location.hostname,modulePathPrefix:null,modulePathCb:null},this.s=this.t.debug?"dev":"prod",this.o=!1,new Proxy(this,{get(t,s){if(t[s])return t[s];const o=e[s];return o&&t.loadModule(`workbox-${o}`),t[s]}})}setConfig(t={}){if(this.o)throw new Error("Config must be set before accessing workbox.* modules");Object.assign(this.t,t),this.s=this.t.debug?"dev":"prod"}loadModule(t){const e=this.i(t);try{importScripts(e),this.o=!0}catch(s){throw console.error(`Unable to import module '${t}' from '${e}'.`),s}}i(e){if(this.t.modulePathCb)return this.t.modulePathCb(e,this.t.debug);let s=[t];const o=`${e}.${this.s}.js`,r=this.t.modulePathPrefix;return r&&""===(s=r.split("/"))[s.length-1]&&s.splice(s.length-1,1),s.push(o),s.join("/")}}}();

workbox.setConfig( {
    "debug": false,
    "modulePathPrefix": "https://kurzweil.com/wp-content/plugins/pwa/wp-includes/js/workbox/"
} );
workbox.core.setCacheNameDetails( {
    "prefix": "wp-/",
    "precache": "precache-front",
    "suffix": "v1"
} );
workbox.core.skipWaiting();
/* global workbox */

/**
 * Handle registering caching strategies.
 */

if ( ! self.wp ) {
	self.wp = {};
}

wp.serviceWorker = workbox;

// Skip the waiting phase for the Service Worker.
self.addEventListener( 'message', function( event ) {
	if ( 'skipWaiting' === event.data.action ) {
		self.skipWaiting();
	}
} );


/* Source wp-precaching-routes: */


// IIFE is used for lexical scoping instead of just a braces block due to bug in Safari.
( () => {
	wp.serviceWorker.precaching.precache( [
    {
        "url": "https://kurzweil.com/?wp_error_template=offline",
        "revision": "0.3.0;Avada=7.2.1;user=0;options=a6653394fba579788b25f0af0a9e5401;nav=6c16ea58cda79d939adf615446d93e3a;deps=d2e34fa37c7b88b00c8585ce42692a38;7101ad4c518651e7672195f675ee4803"
    },
    {
        "url": "https://kurzweil.com/?wp_error_template=500",
        "revision": "0.3.0;Avada=7.2.1;user=0;options=a6653394fba579788b25f0af0a9e5401;nav=6c16ea58cda79d939adf615446d93e3a;deps=d2e34fa37c7b88b00c8585ce42692a38;9aef0db85f2c1a23eca03b82c64d138d"
    }
] );

	// @todo Should not these parameters be specific to each entry as opposed to all entries?
	// @todo Should not the strategy be tied to each entry as well?
	// @todo Use networkFirst instead of cacheFirst when WP_DEBUG.
	wp.serviceWorker.precaching.addRoute( {
		ignoreUrlParametersMatching: [
			/^utm_/,
			/^wp-mce-/,
			/^ver$/,
		],
		// @todo Add urlManipulation which allows for the list of ignoreUrlParametersMatching to be supplied with each entry.
	} );
} )();


/* Source wp-offline-commenting: */


// IIFE is used for lexical scoping instead of just a braces block due to bug with const in Safari.
( () => {
	const queue = new wp.serviceWorker.backgroundSync.Queue( 'wpPendingComments' );
	const errorMessages = {
    "clientOffline": "It seems you are offline. Please check your internet connection and try again.",
    "serverOffline": "The server appears to be down. Please try again later.",
    "error": "Something prevented the page from being rendered. Please try again.",
    "comment": "Your comment will be submitted once you are back online!"
};

	const commentHandler = ( { event } ) => {
		const clone = event.request.clone();
		return fetch( event.request )
			.then( ( response ) => {
				if ( response.status < 500 ) {
					return response;
				}

				// @todo This is duplicated with code in service-worker-navigation-routing.js.
				return response.text().then( function( errorText ) {
					return caches.match( wp.serviceWorker.precaching.getCacheKeyForURL( "https://kurzweil.com/?wp_error_template=500" ) ).then( function( errorResponse ) {
						if ( ! errorResponse ) {
							return response;
						}

						return errorResponse.text().then( function( text ) {
							const init = {
								status: errorResponse.status,
								statusText: errorResponse.statusText,
								headers: errorResponse.headers,
							};

							let body = text.replace( /[<]!--WP_SERVICE_WORKER_ERROR_MESSAGE-->/, errorMessages.error );
							body = body.replace(
								/([<]!--WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN-->)((?:.|\n)+?)([<]!--WP_SERVICE_WORKER_ERROR_TEMPLATE_END-->)/,
								( details ) => {
									if ( ! errorText ) {
										return ''; // Remove the details from the document entirely.
									}
									const src = 'data:text/html;base64,' + btoa( errorText ); // The errorText encoded as a text/html data URL.
									const srcdoc = errorText
										.replace( /&/g, '&amp;' )
										.replace( /'/g, '&#39;' )
										.replace( /"/g, '&quot;' )
										.replace( /</g, '&lt;' )
										.replace( />/g, '&gt;' );
									const iframe = `<iframe style="width:100%" src="${ src }"  srcdoc="${ srcdoc }"></iframe>`;
									details = details.replace( '{{{error_details_iframe}}}', iframe );
									// The following are in case the user wants to include the <iframe> in the template.
									details = details.replace( '{{{iframe_src}}}', src );
									details = details.replace( '{{{iframe_srcdoc}}}', srcdoc );

									// Replace the comments.
									details = details.replace( '<' + '!--WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN-->', '' );
									details = details.replace( '<' + '!--WP_SERVICE_WORKER_ERROR_TEMPLATE_END-->', '' );
									return details;
								}
							);

							return new Response( body, init );
						} );
					} );
				} );
			} )
			.catch( () => {
				const bodyPromise = clone.blob();
				bodyPromise.then(
					function( body ) {
						const request = event.request;
						const req = new Request( request.url, {
							method: request.method,
							headers: request.headers,
							mode: 'same-origin',
							credentials: request.credentials,
							referrer: request.referrer,
							redirect: 'manual',
							body,
						} );

						// Add request to queue.
						queue.pushRequest( {
							request: req,
						} );
					}
				);

				// @todo This is duplicated with code in service-worker-navigation-routing.js.
				return caches.match( wp.serviceWorker.precaching.getCacheKeyForURL( "https://kurzweil.com/?wp_error_template=offline" ) ).then( function( response ) {
					return response.text().then( function( text ) {
						const init = {
							status: response.status,
							statusText: response.statusText,
							headers: response.headers,
						};

						const body = text.replace( /[<]!--WP_SERVICE_WORKER_ERROR_MESSAGE-->/, errorMessages.comment );

						return new Response( body, init );
					} );
				} );
			} );
	};

	wp.serviceWorker.routing.registerRoute(
		/\/wp-comments-post\.php$/,
		commentHandler,
		'POST'
	);
} )();


/* Source wp-navigation-routing: */


// IIFE is used for lexical scoping instead of just a braces block due to bug with const in Safari.
( () => {
	const navigationPreload = true;
	const isStreamingResponses = false && wp.serviceWorker.streams.isSupported();
	const errorMessages = {
    "clientOffline": "It seems you are offline. Please check your internet connection and try again.",
    "serverOffline": "The server appears to be down. Please try again later.",
    "error": "Something prevented the page from being rendered. Please try again.",
    "comment": "Your comment will be submitted once you are back online!"
};
	const navigationRouteEntry = {
    "url": null,
    "revision": "0.3.0;Avada=7.2.1;user=0;options=a6653394fba579788b25f0af0a9e5401;nav=6c16ea58cda79d939adf615446d93e3a;deps=d2e34fa37c7b88b00c8585ce42692a38"
};

	// Configure navigation preload.
	if ( false !== navigationPreload ) {
		if ( typeof navigationPreload === 'string' ) {
			wp.serviceWorker.navigationPreload.enable( navigationPreload );
		} else {
			wp.serviceWorker.navigationPreload.enable();
		}
	} else {
		wp.serviceWorker.navigationPreload.disable();
	}

	/*
	 * Define strategy up front so that Workbox modules will import at install time.
	 * If this is not done, then an error will happen like:
	 * > Unable to import module 'workbox-expiration'
	 * Along with an exception:
	 * > workbox-sw.js:1 Uncaught (in promise) DOMException: Failed to execute 'importScripts' on 'WorkerGlobalScope'
	 */
	const navigationCacheStrategy = new wp.serviceWorker.strategies[ "NetworkOnly" ]( ( function() {const strategyArgs = {};if ( strategyArgs.cacheName && wp.serviceWorker.core.cacheNames.prefix ) { strategyArgs.cacheName = `${wp.serviceWorker.core.cacheNames.prefix}-${strategyArgs.cacheName}`; }strategyArgs.plugins = [];return strategyArgs;} )() );

	/**
	 * Handle navigation request.
	 *
	 * @param {Object} event Event.
	 * @return {Promise<Response>} Response.
	 */
	async function handleNavigationRequest( { event } ) {
		const canStreamResponse = () => {
			return isStreamingResponses && ! navigationPreload;
		};

		const handleResponse = ( response ) => {
			if ( response.status < 500 ) {
				if ( response.redirected && canStreamResponse() ) {
					const redirectedUrl = new URL( response.url );
					redirectedUrl.searchParams.delete( "wp_stream_fragment" );
					const script = `
						<script id="wp-stream-fragment-replace-state">
						history.replaceState( {}, '', ${ JSON.stringify( redirectedUrl.toString() ) } );
						document.getElementById( 'wp-stream-fragment-replace-state' ).remove();
						</script>
					`;
					return response.text().then( ( body ) => {
						return new Response( script + body );
					} );
				}
				return response;
			}

			if ( canStreamResponse() ) {
				return caches.match( wp.serviceWorker.precaching.getCacheKeyForURL( "https://kurzweil.com/?wp_error_template=500&wp_stream_fragment=body" ) );
			}

			const originalResponse = response.clone();
			return response.text().then( function( responseBody ) {
				// Prevent serving custom error template if WordPress is already responding with a valid error page (e.g. via wp_die()).
				if ( -1 !== responseBody.indexOf( '</html>' ) ) {
					return originalResponse;
				}

				return caches.match( wp.serviceWorker.precaching.getCacheKeyForURL( "https://kurzweil.com/?wp_error_template=500" ) ).then( function( errorResponse ) {
					if ( ! errorResponse ) {
						return response;
					}

					return errorResponse.text().then( function( text ) {
						const init = {
							status: errorResponse.status,
							statusText: errorResponse.statusText,
							headers: errorResponse.headers,
						};

						let body = text.replace( /[<]!--WP_SERVICE_WORKER_ERROR_MESSAGE-->/, errorMessages.error );
						body = body.replace(
							/([<]!--WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN-->)((?:.|\n)+?)([<]!--WP_SERVICE_WORKER_ERROR_TEMPLATE_END-->)/,
							( details ) => {
								if ( ! responseBody ) {
									return ''; // Remove the details from the document entirely.
								}
								const src = 'data:text/html;base64,' + btoa( responseBody ); // The errorText encoded as a text/html data URL.
								const srcdoc = responseBody
									.replace( /&/g, '&amp;' )
									.replace( /'/g, '&#39;' )
									.replace( /"/g, '&quot;' )
									.replace( /</g, '&lt;' )
									.replace( />/g, '&gt;' );
								const iframe = `<iframe style="width:100%" src="${ src }" data-srcdoc="${ srcdoc }"></iframe>`;
								details = details.replace( '{{{error_details_iframe}}}', iframe );
								// The following are in case the user wants to include the <iframe> in the template.
								details = details.replace( '{{{iframe_src}}}', src );
								details = details.replace( '{{{iframe_srcdoc}}}', srcdoc );

								// Replace the comments.
								details = details.replace( '<' + '!--WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN-->', '' );
								details = details.replace( '<' + '!--WP_SERVICE_WORKER_ERROR_TEMPLATE_END-->', '' );
								return details;
							}
						);
						return new Response( body, init );
					} );
				} );
			} );
		};

		const sendOfflineResponse = () => {
			if ( canStreamResponse() ) {
				return caches.match( wp.serviceWorker.precaching.getCacheKeyForURL( "https://kurzweil.com/?wp_error_template=offline&wp_stream_fragment=body" ) );
			}

			return caches.match( wp.serviceWorker.precaching.getCacheKeyForURL( "https://kurzweil.com/?wp_error_template=offline" ) ).then( function( response ) {
				return response.text().then( function( text ) {
					const init = {
						status: response.status,
						statusText: response.statusText,
						headers: response.headers,
					};

					const body = text.replace( /[<]!--WP_SERVICE_WORKER_ERROR_MESSAGE-->/, navigator.onLine ? errorMessages.serverOffline : errorMessages.clientOffline );

					return new Response( body, init );
				} );
			} );
		};

		if ( canStreamResponse() ) {
			const streamHeaderFragmentURL = null;
			const precacheStrategy = new wp.serviceWorker.strategies.cacheFirst( {
				cacheName: wp.serviceWorker.core.cacheNames.precache,
			} );

			const url = new URL( event.request.url );
			url.searchParams.append( "wp_stream_fragment", 'body' );
			const init = {
				mode: 'same-origin',
			};
			const copiedProps = [
				'method',
				'headers',
				'credentials',
				'cache',
				'redirect',
				'referrer',
				'integrity',
			];
			for ( const initProp of copiedProps ) {
				init[ initProp ] = event.request[ initProp ];
			}
			const request = new Request( url.toString(), init );
			const stream = wp.serviceWorker.streams.concatenateToResponse( [
				precacheStrategy.makeRequest( { request: streamHeaderFragmentURL } ),
				navigationCacheStrategy.makeRequest( { request } )
					.then( handleResponse )
					.catch( sendOfflineResponse ),
			] );

			return stream.response;
		}
		return navigationCacheStrategy.handle( { event, request: event.request } )
			.then( handleResponse )
			.catch( sendOfflineResponse );
	}

	const blacklist = [
    "^\\/wp\\-admin($|\\?.*|/.*)",
    "[^\\?]*.\\.php($|\\?.*)",
    ".*\\?(.*&)?(wp_stream_fragment|wp_service_worker)=",
    "[^\\?]*\\/feed\\/(\\w+\\/)?$",
    "\\?(.+&)*wp_customize=",
    "\\?(.+&)*customize_changeset_uuid=",
    "^\\/wp\\-json\\/.*"
].map( ( pattern ) => new RegExp( pattern ) );
	if ( navigationRouteEntry && navigationRouteEntry.url ) {
		wp.serviceWorker.routing.registerNavigationRoute(
			navigationRouteEntry.url,
			{ blacklist }
		);

		class FetchNavigationRoute extends wp.serviceWorker.routing.Route {
			/**
			 * If both `blacklist` and `whitelist` are provided, the `blacklist` will
			 * take precedence and the request will not match this route.
			 *
			 * @inheritDoc
			 */
			constructor( handler, {
				whitelist: _whitelist = [ /./ ],
				blacklist: _blacklist = [],
			} = {} ) {
				super( ( options ) => this._match( options ), handler );
				this._whitelist = _whitelist;
				this._blacklist = _blacklist;
			}

			/**
			 * Routes match handler.
			 *
			 * @param {Object} options
			 * @param {URL} options.url
			 * @param {Request} options.request
			 * @return {boolean} Whether there is a match or not.
			 *
			 * @private
			 */
			_match( { url, request } ) {
				// This replaces checking for navigate in NavigationRoute, which looks for 'navigate' instead.
				if ( request.mode !== 'same-origin' ) {
					return false;
				}

				const pathnameAndSearch = url.pathname + url.search;
				for ( const regExp of this._blacklist ) {
					if ( regExp.test( pathnameAndSearch ) ) {
						return false;
					}
				}

				return this._whitelist.some( ( regExp ) => regExp.test( pathnameAndSearch ) );
			}
		}

		wp.serviceWorker.routing.registerRoute(
			new FetchNavigationRoute(
				handleNavigationRequest,
				{ blacklist }
			)
		);
	} else {
		wp.serviceWorker.routing.registerRoute( new wp.serviceWorker.routing.NavigationRoute(
			handleNavigationRequest,
			{ blacklist }
		) );
	}
} )();

// Add fallback network-only navigation route to ensure preloadResponse is used if available.
wp.serviceWorker.routing.registerRoute( new wp.serviceWorker.routing.NavigationRoute(
	new wp.serviceWorker.strategies.NetworkOnly(),
	{
		whitelist: [
    "^\\/wp\\-admin($|\\?.*|/.*)",
    "[^\\?]*.\\.php($|\\?.*)",
    ".*\\?(.*&)?(wp_stream_fragment|wp_service_worker)=",
    "[^\\?]*\\/feed\\/(\\w+\\/)?$",
    "\\?(.+&)*wp_customize=",
    "\\?(.+&)*customize_changeset_uuid=",
    "^\\/wp\\-json\\/.*"
].map( ( pattern ) => new RegExp( pattern ) ),
	}
) );


/* Source wp-caching-routes: */

