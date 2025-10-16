/* eslint-disable */
// documentation officielle: https://developers.google.com/web/tools/workbox/
importScripts('/frontend/angular-1.3.15/serviceWorker/workbox-sw-3.5.0.js');

if (!workbox) {
	console.error(`Workbox didn't load`);
} else {
	// activer les console de debug
	// workbox.setConfig({ debug: true });
	const VERSION = 'v1.0';

	const OFFLINE_PAGE =
		'/frontend/angular-1.3.15/serviceWorker/views/offline.html';

	var ROOT_URL = registration.scope.replace(/mobile\//gim, '');

	/*
	 * handleCacheParams
	 *
	 * clone une requette en retirant les parametre get de la requete qui gèrent le cache _= _t= et v=
	 */
	function handleCacheParams(request) {
		var myUrl = new URL(request.url);
		var isInternalRequest = request.url.indexOf(ROOT_URL) > -1;
		var params = myUrl.searchParams;
		if (
			isInternalRequest &&
			(params.has('_') || params.has('_t') || params.has('v'))
		) {
			params.delete('_');
			params.delete('_t');
			params.delete('v');
			var url = myUrl.toString();
			request = new Request(url, {
				method: request.method,
				headers: request.headers,
				mode: request.mode,
				credentials: request.credentials,
				redirect: request.redirect,
				referrer: request.referrer,
				integrity: request.integrity,
			});
		}
		return request;
	}

	/*
	 * removeCacheGetParamsPlugin
	 *
	 * Retire les parametre GET envoyés par le front pour eviter que
	 * le navigateur ne mette en cache les fichiers
	 *
	 * - retire le param lors du fetch vers le network
	 * - renomme l'url de l'appel dans le cache après son insertion
	 * - essaie de récupérer l'url sans les params dans le cache si fail
	 */
	const removeCacheGetParamsPlugin = {
		requestWillFetch: async ({ request }) => {
			return handleCacheParams(request);
		},
		cachedResponseWillBeUsed: async ({ request, cachedResponse }) => {
			if (cachedResponse) {
				return cachedResponse;
			} else {
				var req = handleCacheParams(request);
				return caches.match(req.url);
			}
		},
		cacheDidUpdate: async ({ cacheName, request }) => {
			var myUrl = new URL(request.url);
			var params = myUrl.searchParams;
			if (params.get('_') || params.get('_t') || params.get('v')) {
				params.delete('_');
				params.delete('_t');
				params.delete('v');
				const freshResponse = await caches.match(request, { cacheName });
				caches
					.open(cacheName)
					.then(function(cache) {
						cache.delete(request.url);
						return cache.put(myUrl.toString(), freshResponse);
					})
					.catch(function(e) {
						return freshResponse;
					});
			}
		},
	};

	// on lance le service worker de suite pour le client
	workbox.skipWaiting();
	workbox.clientsClaim();

	// analytics
	workbox.googleAnalytics.initialize();

	// init des nom de cache
	workbox.core.setCacheNameDetails({
		prefix: 'oxatis',
		suffix: VERSION,
		precache: 'scripts',
		runtime: 'runtime',
	});

	// ne pas toucher -- sera modifié par la tache gulp
	workbox.precaching.precacheAndRoute([
  {
    "url": "/frontend/angular-1.3.15/modules/oxSharedCart/oxSharedCart.js",
    "revision": "d946194bf8942e9cf917188ecc7bff64"
  },
  {
    "url": "/frontend/angular-1.3.15/angularFramework.js",
    "revision": "76515364679ab64b2032928e811eedeb"
  },
  {
    "url": "/frontend/angular-1.3.15/lazyDirectives/all.js",
    "revision": "7c9edad9576c01b379cc4831067c2a51"
  },
  {
    "url": "/frontend/angular-1.3.15/css/oxApps.css",
    "revision": "f1a521d2db3452cd3d9e51c004bc1e0d"
  },
  {
    "url": "/frontend/angular-1.3.15/serviceWorker/views/offline.html",
    "revision": "3d3d871594e3355ea018a06f567d06be"
  }
]);

	// par défaut --> networkFirst + cache si 200 ou 404 (on ne cache pas les reponses 'opaques' ni les POST)
	var defaultStrategy = workbox.strategies.networkFirst({
		cacheName: 'oxatis-runtime-' + VERSION,
		plugins: [
			new workbox.cacheableResponse.Plugin({ statuses: [200, 404] }),
			removeCacheGetParamsPlugin,
		],
	});
	workbox.routing.setDefaultHandler({
		handle: args => {
			// si entete uniquement cache, on ne renvoie rien
			if (
				args.event.request.cache === 'only-if-cached' &&
				args.event.request.mode !== 'same-origin'
			) {
				return;
			}
			if (args.event.request.method === 'GET') {
				return defaultStrategy.handle(args);
			}
			return fetch(args.event.request);
		},
	});

	const regAdmin = /\/(?:tk(.*)|ad(.*)|Login)\.asp/i;
	const fnNetworkOnly = ({ event }) =>
		// urls externes
		(event.request.url.indexOf(ROOT_URL) === -1 &&
			event.request.url.indexOf('.oxatis.com') === -1) ||
		// page d'admin ou toolkit
		(!!event.request.referrer && !!event.request.referrer.match(regAdmin)) ||
		event.request.url.match(regAdmin);

	workbox.routing.registerRoute(
		fnNetworkOnly,
		new workbox.strategies.NetworkOnly()
	);

	// script frontend divers + apps (hors précache qui ne seront pas rapellés)
	workbox.routing.registerRoute(
		/\/frontend(.*)\/angular/,
		workbox.strategies.staleWhileRevalidate({
			cacheName: 'oxatis-scripts-' + VERSION,
			plugins: [removeCacheGetParamsPlugin],
		})
	);

	// appels webservices
	workbox.routing.registerRoute(
		/\/ws\//,
		workbox.strategies.networkFirst({
			cacheName: 'oxatis-ws-' + VERSION,
			plugins: [
				new workbox.expiration.Plugin({
					maxAgeSeconds: 4 * 24 * 60 * 60, // 4 Days
				}),
				removeCacheGetParamsPlugin,
			],
		})
	);

	// images
	workbox.routing.registerRoute(
		/\.(?:png|gif|jpg|jpeg|svg)$/,
		workbox.strategies.cacheFirst({
			cacheName: 'oxatis-images-' + VERSION,
			plugins: [
				new workbox.expiration.Plugin({
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
				}),
			],
		})
	);

	// gestion des actions / pages de navigation
	// --> networkFirst -> cache si pas de réseau --> page offline en dernier recours
	const navigateHandler = workbox.strategies.networkFirst({
		cacheName: 'oxatis-navigate-' + VERSION,
	});
	workbox.routing.registerRoute(
		({ event }) => event.request.mode === 'navigate',
		({ event }) => {
			return navigateHandler
				.handle({ event })
				.then(rsp => {
					return (
						rsp ||
						caches.match(OFFLINE_PAGE).then(function(response) {
							var init = {
								status: response.status,
								statusText: response.statusText,
								headers: {},
							};
							response.headers.forEach(function(v, k) {
								init.headers[k] = v;
							});
							return response.text().then(function(body) {
								return new Response(body, init);
							});
						})
					);
				})
				.catch(() => {
					return caches.match(OFFLINE_PAGE);
				});
		}
	);
}
