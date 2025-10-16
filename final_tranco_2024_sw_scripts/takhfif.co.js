/* PWA v0.8.0-front */

/* توجه: این فایل به صورت پویا ایجاد می‌شود. برای دستکاری محتویات این پرونده، از عملگر `wp_front_service_worker` در وردپرس استفاده کنید. /*


/* Source wp-base-config: */
!function(){"use strict";try{self["workbox:sw:7.0.0"]&&_()}catch(t){}const t={backgroundSync:"background-sync",broadcastUpdate:"broadcast-update",cacheableResponse:"cacheable-response",core:"core",expiration:"expiration",googleAnalytics:"offline-ga",navigationPreload:"navigation-preload",precaching:"precaching",rangeRequests:"range-requests",routing:"routing",strategies:"strategies",streams:"streams",recipes:"recipes"};self.workbox=new class{constructor(){return this.v={},this.Pt={debug:"localhost"===self.location.hostname,modulePathPrefix:null,modulePathCb:null},this.$t=this.Pt.debug?"dev":"prod",this.jt=!1,new Proxy(this,{get(e,s){if(e[s])return e[s];const o=t[s];return o&&e.loadModule(`workbox-${o}`),e[s]}})}setConfig(t={}){if(this.jt)throw new Error("Config must be set before accessing workbox.* modules");Object.assign(this.Pt,t),this.$t=this.Pt.debug?"dev":"prod"}loadModule(t){const e=this.St(t);try{importScripts(e),this.jt=!0}catch(s){throw console.error(`Unable to import module '${t}' from '${e}'.`),s}}St(t){if(this.Pt.modulePathCb)return this.Pt.modulePathCb(t,this.Pt.debug);let e=["https://storage.googleapis.com/workbox-cdn/releases/7.0.0"];const s=`${t}.${this.$t}.js`,o=this.Pt.modulePathPrefix;return o&&(e=o.split("/"),""===e[e.length-1]&&e.splice(e.length-1,1)),e.push(s),e.join("/")}}}();
workbox.setConfig( {"debug":false,"modulePathPrefix":"https:\/\/takhfif.co\/wp-content\/plugins\/pwa\/wp-includes\/js\/workbox-v7.0.0\/"} );
workbox.core.setCacheNameDetails( {"prefix":"wp-\/","precache":"precache-front","suffix":"v1"} );
self.skipWaiting();
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
	if (!event.data) {
		return;
	}
	if (
		// De facto standard used by Workbox.
		event.data.type === 'SKIP_WAITING' ||
		// Obsolete message sent in older versions of the plugin.
		'skipWaiting' === event.data.action
	) {
		self.skipWaiting();
	}
});


/* Source wp-precaching-routes: */


// IIFE is used for lexical scoping instead of just a braces block due to bug in Safari.
(() => {
	wp.serviceWorker.precaching.precache([{"url":"https:\/\/takhfif.co\/?wp_error_template=offline","revision":"0.8.0;takhfifco 3=1.0;options=aa80a25deb426799daaa87b608e7f999;nav=ac6e62095d47a01cf43c6554d23bf77c;deps=f36eb8c0f04c2eb5b096a23fe9ff2f00;67f8010cef35b7a7ea59955c0d1ace14"},{"url":"https:\/\/takhfif.co\/?wp_error_template=500","revision":"0.8.0;takhfifco 3=1.0;options=aa80a25deb426799daaa87b608e7f999;nav=ac6e62095d47a01cf43c6554d23bf77c;deps=f36eb8c0f04c2eb5b096a23fe9ff2f00;1602c818af7fa7cba9d176712ab1499e"}]);

	// @todo Should not these parameters be specific to each entry as opposed to all entries?
	// @todo Should not the strategy be tied to each entry as well?
	// @todo Use networkFirst instead of cacheFirst when WP_DEBUG.
	wp.serviceWorker.precaching.addRoute({
		ignoreUrlParametersMatching: [/^utm_/, /^wp-mce-/, /^ver$/],
		// @todo Add urlManipulation which allows for the list of ignoreUrlParametersMatching to be supplied with each entry.
	});
})();


/* Source wp-offline-post-request-handling: */


// IIFE is used for lexical scoping instead of just a braces block due to bug with const in Safari.
(() => {
	const errorMessages = {"clientOffline":"\u0628\u0647 \u0646\u0638\u0631 \u0645\u06cc \u0631\u0633\u062f \u06a9\u0647 \u0634\u0645\u0627 \u0622\u0641\u0644\u0627\u06cc\u0646 \u0647\u0633\u062a\u06cc\u062f. \u0644\u0637\u0641\u0627 \u062f\u0633\u062a\u0631\u0633\u06cc \u0627\u06cc\u0646\u0631\u0646\u062a \u062e\u0648\u062f \u0631\u0627 \u0686\u06a9 \u0628\u0631\u0631\u0633\u06cc \u0648 \u062f\u0648\u0628\u0627\u0631\u0647 \u0627\u0645\u062a\u062d\u0627\u0646 \u06a9\u0646\u06cc\u062f.","serverOffline":"\u0628\u0647 \u0646\u0638\u0631 \u0645\u06cc \u0631\u0633\u062f \u06a9\u0647 \u0633\u0631\u0648\u0631 \u0642\u0637\u0639 \u0627\u0633\u062a. \u06cc\u0627 \u0627\u062a\u0635\u0627\u0644 \u0634\u0645\u0627 \u0645\u0637\u0627\u0628\u0642 \u0627\u0646\u062a\u0638\u0627\u0631 \u06a9\u0627\u0631 \u0646\u0645\u06cc\u200c\u06a9\u0646\u062f. \u0644\u0637\u0641\u0627\u064b \u0628\u0639\u062f\u0627\u064b \u062f\u0648\u0628\u0627\u0631\u0647 \u0627\u0645\u062a\u062d\u0627\u0646 \u06a9\u0646\u06cc\u062f.","error":"\u0686\u06cc\u0632\u06cc \u0645\u0627\u0646\u0639 \u0627\u0632 \u0631\u0646\u062f\u0631 \u0634\u062f\u0646 \u0635\u0641\u062d\u0647 \u0634\u062f. \u0644\u0637\u0641\u0627 \u062f\u0648\u0628\u0627\u0631\u0647 \u062a\u0644\u0627\u0634 \u06a9\u0646\u06cc\u062f.","submissionFailure":"\u0627\u0631\u0633\u0627\u0644 \u0634\u0645\u0627 \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062f. \u0644\u0637\u0641\u0627 \u0628\u0631\u06af\u0631\u062f\u06cc\u062f \u0648 \u062f\u0648\u0628\u0627\u0631\u0647 \u0627\u0645\u062a\u062d\u0627\u0646 \u06a9\u0646\u06cc\u062f."};

	/**
	 * Inject navigation request properties.
	 *
	 * @param {string}   body
	 * @param {Request}  request
	 * @param {Response} response
	 * @return {string} Modified body.
	 */
	const injectNavigationRequestProperties = (body, request, response) => {
		return body.replace(
			'{{{WP_NAVIGATION_REQUEST_PROPERTIES}}}',
			JSON.stringify({
				method: request.method,
				status: response.status,
			})
		);
	};

	const offlinePostRequestHandler = ({ event }) => {
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
								"https:\/\/takhfif.co\/?wp_error_template=500"
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
									'{{{WP_SERVICE_WORKER_ERROR_MESSAGE}}}',
									`${errorMessages.error} <strong>${errorMessages.submissionFailure}</strong>`
								);

								body = injectNavigationRequestProperties(
									body,
									event.request,
									response
								);

								body = body.replace(
									/({{{WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN}}})((?:.|\n)+?)({{{WP_SERVICE_WORKER_ERROR_TEMPLATE_END}}})/,
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
											'{{{WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN}}}',
											''
										);
										details = details.replace(
											'{{{WP_SERVICE_WORKER_ERROR_TEMPLATE_END}}}',
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
				// @todo This is duplicated with code in service-worker-navigation-routing.js.
				return caches
					.match(
						wp.serviceWorker.precaching.getCacheKeyForURL(
							"https:\/\/takhfif.co\/?wp_error_template=offline"
						)
					)
					.then(function (response) {
						return response.text().then(function (text) {
							const init = {
								status: response.status,
								statusText: response.statusText,
								headers: response.headers,
							};

							const connectionMessage = navigator.onLine
								? errorMessages.serverOffline
								: errorMessages.clientOffline;

							let body = text.replace(
								'{{{WP_SERVICE_WORKER_ERROR_MESSAGE}}}',
								`${connectionMessage} <strong>${errorMessages.submissionFailure}</strong>`
							);

							body = injectNavigationRequestProperties(
								body,
								event.request,
								response
							);

							return new Response(body, init);
						});
					});
			});
	};

	wp.serviceWorker.routing.registerRoute(
		/.*/,
		offlinePostRequestHandler,
		'POST'
	);
})();


/* Source wp-navigation-routing: */


// IIFE is used for lexical scoping instead of just a braces block due to bug with const in Safari.
(() => {
	const navigationPreload = true;
	const errorMessages = {"clientOffline":"\u0628\u0647 \u0646\u0638\u0631 \u0645\u06cc \u0631\u0633\u062f \u06a9\u0647 \u0634\u0645\u0627 \u0622\u0641\u0644\u0627\u06cc\u0646 \u0647\u0633\u062a\u06cc\u062f. \u0644\u0637\u0641\u0627 \u062f\u0633\u062a\u0631\u0633\u06cc \u0627\u06cc\u0646\u0631\u0646\u062a \u062e\u0648\u062f \u0631\u0627 \u0686\u06a9 \u0628\u0631\u0631\u0633\u06cc \u0648 \u062f\u0648\u0628\u0627\u0631\u0647 \u0627\u0645\u062a\u062d\u0627\u0646 \u06a9\u0646\u06cc\u062f.","serverOffline":"\u0628\u0647 \u0646\u0638\u0631 \u0645\u06cc \u0631\u0633\u062f \u06a9\u0647 \u0633\u0631\u0648\u0631 \u0642\u0637\u0639 \u0627\u0633\u062a. \u06cc\u0627 \u0627\u062a\u0635\u0627\u0644 \u0634\u0645\u0627 \u0645\u0637\u0627\u0628\u0642 \u0627\u0646\u062a\u0638\u0627\u0631 \u06a9\u0627\u0631 \u0646\u0645\u06cc\u200c\u06a9\u0646\u062f. \u0644\u0637\u0641\u0627\u064b \u0628\u0639\u062f\u0627\u064b \u062f\u0648\u0628\u0627\u0631\u0647 \u0627\u0645\u062a\u062d\u0627\u0646 \u06a9\u0646\u06cc\u062f.","error":"\u0686\u06cc\u0632\u06cc \u0645\u0627\u0646\u0639 \u0627\u0632 \u0631\u0646\u062f\u0631 \u0634\u062f\u0646 \u0635\u0641\u062d\u0647 \u0634\u062f. \u0644\u0637\u0641\u0627 \u062f\u0648\u0628\u0627\u0631\u0647 \u062a\u0644\u0627\u0634 \u06a9\u0646\u06cc\u062f.","submissionFailure":"\u0627\u0631\u0633\u0627\u0644 \u0634\u0645\u0627 \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062f. \u0644\u0637\u0641\u0627 \u0628\u0631\u06af\u0631\u062f\u06cc\u062f \u0648 \u062f\u0648\u0628\u0627\u0631\u0647 \u0627\u0645\u062a\u062d\u0627\u0646 \u06a9\u0646\u06cc\u062f."};
	const navigationRouteEntry = {"url":null,"revision":"0.8.0;takhfifco 3=1.0;options=aa80a25deb426799daaa87b608e7f999;nav=ac6e62095d47a01cf43c6554d23bf77c;deps=f36eb8c0f04c2eb5b096a23fe9ff2f00"};

	/**
	 * Inject navigation request properties.
	 *
	 * @param {string}   body
	 * @param {Request}  request
	 * @param {Response} response
	 * @return {string} Modified body.
	 */
	const injectNavigationRequestProperties = (body, request, response) => {
		return body.replace(
			'{{{WP_NAVIGATION_REQUEST_PROPERTIES}}}',
			JSON.stringify({
				method: request.method,
				status: response.status,
			})
		);
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
	](( function() {const strategyArgs = {"cacheName":"navigations"};if ( strategyArgs.cacheName && wp.serviceWorker.core.cacheNames.prefix ) { strategyArgs.cacheName = `${wp.serviceWorker.core.cacheNames.prefix}-${strategyArgs.cacheName}`; }strategyArgs.plugins = [new wp.serviceWorker[ "expiration" ][ "ExpirationPlugin" ]( {"maxEntries":10} )];return strategyArgs;} )());

	/**
	 * Handle navigation request.
	 *
	 * @param {Object}     args       Args.
	 * @param {FetchEvent} args.event Event.
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
							"https:\/\/takhfif.co\/?wp_error_template=500"
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
								'{{{WP_SERVICE_WORKER_ERROR_MESSAGE}}}',
								errorMessages.error
							);

							body = injectNavigationRequestProperties(
								body,
								event.request,
								response
							);

							body = body.replace(
								/({{{WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN}}})((?:.|\n)+?)({{{WP_SERVICE_WORKER_ERROR_TEMPLATE_END}}})/,
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
										'{{{WP_SERVICE_WORKER_ERROR_TEMPLATE_BEGIN}}}',
										''
									);
									details = details.replace(
										'{{{WP_SERVICE_WORKER_ERROR_TEMPLATE_END}}}',
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
						"https:\/\/takhfif.co\/?wp_error_template=offline"
					)
				)
				.then(function (response) {
					return response.text().then(function (text) {
						const init = {
							status: response.status,
							statusText: response.statusText,
							headers: response.headers,
						};

						let body = text.replace(
							'{{{WP_SERVICE_WORKER_ERROR_MESSAGE}}}',
							navigator.onLine
								? errorMessages.serverOffline
								: errorMessages.clientOffline
						);

						body = injectNavigationRequestProperties(
							body,
							event.request,
							response
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

	const denylist = ["^\\\/wp\\-admin($|\\?|\/)","^[^\\?]*?\\.php($|\\?)","\\?(.*?&)?wp_service_worker=","^[^\\?]*?\\\/wp\\.serviceworker(\\?|$)","^[^\\?]*?\\\/feed\\\/(\\w+\\\/)?$","\\?(.*?&)?wp_customize=","\\?(.*?&)?customize_changeset_uuid=","^\\\/wp\\-json\\\/"].map(
		(pattern) => new RegExp(pattern)
	);
	if (navigationRouteEntry && navigationRouteEntry.url) {
		wp.serviceWorker.routing.registerRoute(
			new wp.serviceWorker.routing.NavigationRoute(
				wp.serviceWorker.precaching.createHandlerBoundToURL(
					navigationRouteEntry.url
				),
				{
					denylist,
				}
			)
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
			 * @param {Object}  options
			 * @param {URL}     options.url
			 * @param {Request} options.request
			 * @return {boolean} Whether there is a match or not.
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
			allowlist: ["^\\\/wp\\-admin($|\\?|\/)","^[^\\?]*?\\.php($|\\?)","\\?(.*?&)?wp_service_worker=","^[^\\?]*?\\\/wp\\.serviceworker(\\?|$)","^[^\\?]*?\\\/feed\\\/(\\w+\\\/)?$","\\?(.*?&)?wp_customize=","\\?(.*?&)?customize_changeset_uuid=","^\\\/wp\\-json\\\/"].map(
				(pattern) => new RegExp(pattern)
			),
		}
	)
);


/* Source wp-caching-routes: */

