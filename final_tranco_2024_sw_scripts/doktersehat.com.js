/* PWA v0.5.0-front */


/* Source wp-base-config: */
!function(){"use strict";try{self["workbox:sw:5.1.3"]&&_()}catch(t){}const t={backgroundSync:"background-sync",broadcastUpdate:"broadcast-update",cacheableResponse:"cacheable-response",core:"core",expiration:"expiration",googleAnalytics:"offline-ga",navigationPreload:"navigation-preload",precaching:"precaching",rangeRequests:"range-requests",routing:"routing",strategies:"strategies",streams:"streams"};self.workbox=new class{constructor(){return this.v={},this.t={debug:"localhost"===self.location.hostname,modulePathPrefix:null,modulePathCb:null},this.s=this.t.debug?"dev":"prod",this.o=!1,new Proxy(this,{get(e,s){if(e[s])return e[s];const o=t[s];return o&&e.loadModule(`workbox-${o}`),e[s]}})}setConfig(t={}){if(this.o)throw new Error("Config must be set before accessing workbox.* modules");Object.assign(this.t,t),this.s=this.t.debug?"dev":"prod"}loadModule(t){const e=this.i(t);try{importScripts(e),this.o=!0}catch(s){throw console.error(`Unable to import module '${t}' from '${e}'.`),s}}i(t){if(this.t.modulePathCb)return this.t.modulePathCb(t,this.t.debug);let e=["https://storage.googleapis.com/workbox-cdn/releases/5.1.3"];const s=`${t}.${this.s}.js`,o=this.t.modulePathPrefix;return o&&(e=o.split("/"),""===e[e.length-1]&&e.splice(e.length-1,1)),e.push(s),e.join("/")}}}();
workbox.setConfig( {
    "debug": false,
    "modulePathPrefix": "https://doktersehat.com/wp-content/plugins/pwa/wp-includes/js/workbox-v5.1.3/"
} );
workbox.core.setCacheNameDetails( {
    "prefix": "wp-/",
    "precache": "precache-front",
    "suffix": "v1"
} );
workbox.core.skipWaiting();
workbox.core.clientsClaim();
/* global workbox */

/**
 * Handle registering caching strategies.
 */

if (!self.wp) {
	self.wp = {};
}

wp.serviceWorker = workbox;

/*
 * Skip the waiting phase for the Service Worker when a message with a 'skipWaiting' action is sent from a client.
 * Note that this message is not currently being sent in the codebase, but the logic remains here to provide a
 * mechanism for clients to skip waiting if they want to.
 */
self.addEventListener('message', function (event) {
	if ('skipWaiting' === event.data.action) {
		self.skipWaiting();
	}
});


/* Source wp-precaching-routes: */


// IIFE is used for lexical scoping instead of just a braces block due to bug in Safari.
(() => {
	wp.serviceWorker.precaching.precache([
    {
        "url": "https://doktersehat.com/?wp_error_template=offline",
        "revision": "0.5.0;Avada=6.1.2;Avada-Child-Theme=1.0.0;options=2a8ddc6980e4563036eb69ef8496e766;nav=78be10e587348fe0cf0628ec5a661ba0;deps=19d3cb11a43e901b4ec04384557c33ae;2bd7a9bb263e7173baf974b9046a2677"
    },
    {
        "url": "https://doktersehat.com/?wp_error_template=500",
        "revision": "0.5.0;Avada=6.1.2;Avada-Child-Theme=1.0.0;options=2a8ddc6980e4563036eb69ef8496e766;nav=78be10e587348fe0cf0628ec5a661ba0;deps=19d3cb11a43e901b4ec04384557c33ae;cb21a705e60f14a0f97df136e58e762a"
    }
]);

	// @todo Should not these parameters be specific to each entry as opposed to all entries?
	// @todo Should not the strategy be tied to each entry as well?
	// @todo Use networkFirst instead of cacheFirst when WP_DEBUG.
	wp.serviceWorker.precaching.addRoute({
		ignoreUrlParametersMatching: [/^utm_/, /^wp-mce-/, /^ver$/],
		// @todo Add urlManipulation which allows for the list of ignoreUrlParametersMatching to be supplied with each entry.
	});
})();


/* Source wp-offline-commenting: */


// IIFE is used for lexical scoping instead of just a braces block due to bug with const in Safari.
(() => {
	const queue = new wp.serviceWorker.backgroundSync.Queue(
		'wpPendingComments'
	);
	const errorMessages = {
    "clientOffline": "It seems you are offline. Please check your internet connection and try again.",
    "serverOffline": "The server appears to be down. Please try again later.",
    "error": "Something prevented the page from being rendered. Please try again.",
    "comment": "Your comment will be submitted once you are back online!"
};

	const commentHandler = ({ event }) => {
		const clone = event.request.clone();
		return fetch(event.request)
			.then((response) => {
				if (response.status < 500) {
					return response;
				}

				// @todo This is duplicated with code in service-worker-navigation-routing.js.
				return response.text().then(function (errorText) {
					return caches
						.match(
							wp.serviceWorker.precaching.getCacheKeyForURL(
								"https://doktersehat.com/?wp_error_template=500"
							)
						)
						.then(function (errorResponse) {
							if (!errorResponse) {
								return response;
							}

							return errorResponse.text().then(function (text) {
								const init = {
									status: errorResponse.status,
									statusText: errorResponse.statusText,
									headers: errorResponse.headers,
								};

								let body = text.replace(
									/[<]!--WP_SERVICE_WORKER_ERROR_MESSAGE-->/,
									errorMessages.error
								);
								body = body.replace(
									/([<]!--WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN-->)((?:.|\n)+?)([<]!--WP_SERVICE_WORKER_ERROR_TEMPLATE_END-->)/,
									(details) => {
										if (!errorText) {
											return ''; // Remove the details from the document entirely.
										}
										const src =
											'data:text/html;base64,' +
											btoa(errorText); // The errorText encoded as a text/html data URL.
										const srcdoc = errorText
											.replace(/&/g, '&amp;')
											.replace(/'/g, '&#39;')
											.replace(/"/g, '&quot;')
											.replace(/</g, '&lt;')
											.replace(/>/g, '&gt;');
										const iframe = `<iframe style="width:100%" src="${src}"  srcdoc="${srcdoc}"></iframe>`;
										details = details.replace(
											'{{{error_details_iframe}}}',
											iframe
										);
										// The following are in case the user wants to include the <iframe> in the template.
										details = details.replace(
											'{{{iframe_src}}}',
											src
										);
										details = details.replace(
											'{{{iframe_srcdoc}}}',
											srcdoc
										);

										// Replace the comments.
										details = details.replace(
											'<' +
												'!--WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN-->',
											''
										);
										details = details.replace(
											'<' +
												'!--WP_SERVICE_WORKER_ERROR_TEMPLATE_END-->',
											''
										);
										return details;
									}
								);

								return new Response(body, init);
							});
						});
				});
			})
			.catch(() => {
				const bodyPromise = clone.blob();
				bodyPromise.then(function (body) {
					const request = event.request;
					const req = new Request(request.url, {
						method: request.method,
						headers: request.headers,
						mode: 'same-origin',
						credentials: request.credentials,
						referrer: request.referrer,
						redirect: 'manual',
						body,
					});

					// Add request to queue.
					queue.pushRequest({
						request: req,
					});
				});

				// @todo This is duplicated with code in service-worker-navigation-routing.js.
				return caches
					.match(
						wp.serviceWorker.precaching.getCacheKeyForURL(
							"https://doktersehat.com/?wp_error_template=offline"
						)
					)
					.then(function (response) {
						return response.text().then(function (text) {
							const init = {
								status: response.status,
								statusText: response.statusText,
								headers: response.headers,
							};

							const body = text.replace(
								/[<]!--WP_SERVICE_WORKER_ERROR_MESSAGE-->/,
								errorMessages.comment
							);

							return new Response(body, init);
						});
					});
			});
	};

	wp.serviceWorker.routing.registerRoute(
		/\/wp-comments-post\.php$/,
		commentHandler,
		'POST'
	);
})();


/* Source wp-navigation-routing: */


// IIFE is used for lexical scoping instead of just a braces block due to bug with const in Safari.
(() => {
	const navigationPreload = true;
	const errorMessages = {
    "clientOffline": "It seems you are offline. Please check your internet connection and try again.",
    "serverOffline": "The server appears to be down. Please try again later.",
    "error": "Something prevented the page from being rendered. Please try again.",
    "comment": "Your comment will be submitted once you are back online!"
};
	const navigationRouteEntry = {
    "url": null,
    "revision": "0.5.0;Avada=6.1.2;Avada-Child-Theme=1.0.0;options=2a8ddc6980e4563036eb69ef8496e766;nav=78be10e587348fe0cf0628ec5a661ba0;deps=19d3cb11a43e901b4ec04384557c33ae"
};

	// Configure navigation preload.
	if (false !== navigationPreload) {
		if (typeof navigationPreload === 'string') {
			wp.serviceWorker.navigationPreload.enable(navigationPreload);
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
	const navigationCacheStrategy = new wp.serviceWorker.strategies[
		"NetworkOnly"
	](( function() {const strategyArgs = {};if ( strategyArgs.cacheName && wp.serviceWorker.core.cacheNames.prefix ) { strategyArgs.cacheName = `${wp.serviceWorker.core.cacheNames.prefix}-${strategyArgs.cacheName}`; }strategyArgs.plugins = [];return strategyArgs;} )());

	/**
	 * Handle navigation request.
	 *
	 * @param {Object} event Event.
	 * @return {Promise<Response>} Response.
	 */
	async function handleNavigationRequest({ event }) {
		const handleResponse = (response) => {
			if (response.status < 500) {
				return response;
			}

			const originalResponse = response.clone();
			return response.text().then(function (responseBody) {
				// Prevent serving custom error template if WordPress is already responding with a valid error page (e.g. via wp_die()).
				if (-1 !== responseBody.indexOf('</html>')) {
					return originalResponse;
				}

				return caches
					.match(
						wp.serviceWorker.precaching.getCacheKeyForURL(
							"https://doktersehat.com/?wp_error_template=500"
						)
					)
					.then(function (errorResponse) {
						if (!errorResponse) {
							return response;
						}

						return errorResponse.text().then(function (text) {
							const init = {
								status: errorResponse.status,
								statusText: errorResponse.statusText,
								headers: errorResponse.headers,
							};

							let body = text.replace(
								/[<]!--WP_SERVICE_WORKER_ERROR_MESSAGE-->/,
								errorMessages.error
							);
							body = body.replace(
								/([<]!--WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN-->)((?:.|\n)+?)([<]!--WP_SERVICE_WORKER_ERROR_TEMPLATE_END-->)/,
								(details) => {
									if (!responseBody) {
										return ''; // Remove the details from the document entirely.
									}
									const src =
										'data:text/html;base64,' +
										btoa(responseBody); // The errorText encoded as a text/html data URL.
									const srcdoc = responseBody
										.replace(/&/g, '&amp;')
										.replace(/'/g, '&#39;')
										.replace(/"/g, '&quot;')
										.replace(/</g, '&lt;')
										.replace(/>/g, '&gt;');
									const iframe = `<iframe style="width:100%" src="${src}" data-srcdoc="${srcdoc}"></iframe>`;
									details = details.replace(
										'{{{error_details_iframe}}}',
										iframe
									);
									// The following are in case the user wants to include the <iframe> in the template.
									details = details.replace(
										'{{{iframe_src}}}',
										src
									);
									details = details.replace(
										'{{{iframe_srcdoc}}}',
										srcdoc
									);

									// Replace the comments.
									details = details.replace(
										'<' +
											'!--WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN-->',
										''
									);
									details = details.replace(
										'<' +
											'!--WP_SERVICE_WORKER_ERROR_TEMPLATE_END-->',
										''
									);
									return details;
								}
							);
							return new Response(body, init);
						});
					});
			});
		};

		const sendOfflineResponse = () => {
			return caches
				.match(
					wp.serviceWorker.precaching.getCacheKeyForURL(
						"https://doktersehat.com/?wp_error_template=offline"
					)
				)
				.then(function (response) {
					return response.text().then(function (text) {
						const init = {
							status: response.status,
							statusText: response.statusText,
							headers: response.headers,
						};

						const body = text.replace(
							/[<]!--WP_SERVICE_WORKER_ERROR_MESSAGE-->/,
							navigator.onLine
								? errorMessages.serverOffline
								: errorMessages.clientOffline
						);

						return new Response(body, init);
					});
				});
		};

		return navigationCacheStrategy
			.handle({ event, request: event.request })
			.then(handleResponse)
			.catch(sendOfflineResponse);
	}

	const denylist = [
    "^\\/wp\\-admin($|\\?.*|/.*)",
    "[^\\?]*.\\.php($|\\?.*)",
    ".*\\?(.*&)?(wp_service_worker)=",
    "[^\\?]*\\/feed\\/(\\w+\\/)?$",
    "\\?(.+&)*wp_customize=",
    "\\?(.+&)*customize_changeset_uuid=",
    "^\\/wp\\-json\\/.*"
].map(
		(pattern) => new RegExp(pattern)
	);
	if (navigationRouteEntry && navigationRouteEntry.url) {
		wp.serviceWorker.routing.registerNavigationRoute(
			navigationRouteEntry.url,
			{
				denylist,
			}
		);

		class FetchNavigationRoute extends wp.serviceWorker.routing.Route {
			/**
			 * If both `denylist` and `allowlist` are provided, the `denylist` will
			 * take precedence and the request will not match this route.
			 *
			 * @inheritdoc
			 */
			constructor(
				handler,
				{ allowlist: _allowlist = [/./], denylist: _denylist = [] } = {}
			) {
				super((options) => this._match(options), handler);
				this._allowlist = _allowlist;
				this._denylist = _denylist;
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
			_match({ url, request }) {
				// This replaces checking for navigate in NavigationRoute, which looks for 'navigate' instead.
				if (request.mode !== 'same-origin') {
					return false;
				}

				const pathnameAndSearch = url.pathname + url.search;
				// eslint-disable-next-line no-unused-vars
				for (const regExp of this._denylist) {
					if (regExp.test(pathnameAndSearch)) {
						return false;
					}
				}

				return this._allowlist.some((regExp) =>
					regExp.test(pathnameAndSearch)
				);
			}
		}

		wp.serviceWorker.routing.registerRoute(
			new FetchNavigationRoute(handleNavigationRequest, { denylist })
		);
	} else {
		wp.serviceWorker.routing.registerRoute(
			new wp.serviceWorker.routing.NavigationRoute(
				handleNavigationRequest,
				{
					denylist,
				}
			)
		);
	}
})();

// Add fallback network-only navigation route to ensure preloadResponse is used if available.
wp.serviceWorker.routing.registerRoute(
	new wp.serviceWorker.routing.NavigationRoute(
		new wp.serviceWorker.strategies.NetworkOnly(),
		{
			allowlist: [
    "^\\/wp\\-admin($|\\?.*|/.*)",
    "[^\\?]*.\\.php($|\\?.*)",
    ".*\\?(.*&)?(wp_service_worker)=",
    "[^\\?]*\\/feed\\/(\\w+\\/)?$",
    "\\?(.+&)*wp_customize=",
    "\\?(.+&)*customize_changeset_uuid=",
    "^\\/wp\\-json\\/.*"
].map(
				(pattern) => new RegExp(pattern)
			),
		}
	)
);


/* Source wp-caching-routes: */

