/* PWA v0.8.2-front */

/* Note: This file is dynamically generated. To manipulate the contents of this file, use the `wp_front_service_worker` action in WordPress. /*


/* Source wp-base-config: */
!function(){"use strict";try{self["workbox:sw:7.3.0"]&&_()}catch(t){}const t={backgroundSync:"background-sync",broadcastUpdate:"broadcast-update",cacheableResponse:"cacheable-response",core:"core",expiration:"expiration",googleAnalytics:"offline-ga",navigationPreload:"navigation-preload",precaching:"precaching",rangeRequests:"range-requests",routing:"routing",strategies:"strategies",streams:"streams",recipes:"recipes"};self.workbox=new class{constructor(){return this.v={},this.Pt={debug:"localhost"===self.location.hostname,modulePathPrefix:null,modulePathCb:null},this.$t=this.Pt.debug?"dev":"prod",this.jt=!1,new Proxy(this,{get(e,s){if(e[s])return e[s];const o=t[s];return o&&e.loadModule(`workbox-${o}`),e[s]}})}setConfig(t={}){if(this.jt)throw new Error("Config must be set before accessing workbox.* modules");Object.assign(this.Pt,t),this.$t=this.Pt.debug?"dev":"prod"}loadModule(t){const e=this.St(t);try{importScripts(e),this.jt=!0}catch(s){throw console.error(`Unable to import module '${t}' from '${e}'.`),s}}St(t){if(this.Pt.modulePathCb)return this.Pt.modulePathCb(t,this.Pt.debug);let e=["https://storage.googleapis.com/workbox-cdn/releases/7.3.0"];const s=`${t}.${this.$t}.js`,o=this.Pt.modulePathPrefix;return o&&(e=o.split("/"),""===e[e.length-1]&&e.splice(e.length-1,1)),e.push(s),e.join("/")}}}();
workbox.setConfig( {"debug":false,"modulePathPrefix":"https:\/\/hechingerreport.org\/wp-content\/plugins\/pwa\/wp-includes\/js\/workbox-v7.3.0\/"} );
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
	wp.serviceWorker.precaching.precache([{"url":"https:\/\/hechingerreport.org\/?wp_error_template=offline","revision":"0.8.2;newspack-theme=2.3.0;newspack-nelson=2.3.0;options=72c59037cdb1989fc0e1aab2c64a3caa;nav=2d477ae37e49e541646781a119dc0814;deps=f720191a1a9641193ce5d698747db190;0c2d584d75142f0aa2defbab82478d65"},{"url":"https:\/\/hechingerreport.org\/?wp_error_template=500","revision":"0.8.2;newspack-theme=2.3.0;newspack-nelson=2.3.0;options=72c59037cdb1989fc0e1aab2c64a3caa;nav=2d477ae37e49e541646781a119dc0814;deps=f720191a1a9641193ce5d698747db190;2850a6265d25f3a1d90f8b58b11ca343"}]);

	// @todo Should not these parameters be specific to each entry as opposed to all entries?
	// @todo Should not the strategy be tied to each entry as well?
	// @todo Use networkFirst instead of cacheFirst when WP_DEBUG.
	wp.serviceWorker.precaching.addRoute({
		ignoreUrlParametersMatching: [/^utm_/, /^wp-mce-/, /^ver$/],
		// @todo Add urlManipulation which allows for the list of ignoreUrlParametersMatching to be supplied with each entry.
	});
})();


/* Source newspack-sw <https://hechingerreport.org/wp-content/plugins/newspack-manager/includes/service-worker.js>: */
let requestCount = {};
let nonceValue = '';
let currentPage = '';
let versionValue = false;

self.addEventListener('message', function (event) {
	if (event.data === 'newspack-reset-request-count') {
		requestCount = {};
	}
	if (event.data.indexOf('newspack-nonce-') === 0) {
		nonceValue = event.data.replace('newspack-nonce-', '');
	}
	if (event.data.indexOf('newspack-version-') === 0) {
		versionValue = event.data.replace('newspack-version-', '');
	}
});

const findProperty = payload => {
	const found = payload.match(/tid=([\w-]*)/);
	if (found) {
		return found[1];
	}
};

const sendMessage = message =>
	fetch(
		`/wp-json/newspack-manager/v1/sw-message?message=${encodeURIComponent(
			`${message} (URL: ${currentPage})`
		)}&nonce=${nonceValue}&version=${versionValue}`
	);

const handlePageViewForProperty = (clientId, property) => {
	if (!requestCount[clientId]) {
		requestCount[clientId] = {};
	}
	requestCount[clientId][property] = requestCount[clientId][property] + 1 || 1;
	if (requestCount[clientId][property] > 1) {
		sendMessage(`Property \`${property}\` has sent more than two pageviews per request.`);
	}
};

self.addEventListener('fetch', async event => {
	const url = event.request.url;
	if (url.match(/google-analytics\.com.*\/collect/)) {
		if (!event.clientId) {
			return;
		}
		const client = await self.clients.get(event.clientId);
		if (!client) {
			return;
		}
		currentPage = client.url;
		const { search } = new URL(url);
		let property = findProperty(search);
		let params = search.replace(/^\?/, '').split('&');
		const text = await event.request.text();
		if (!property) {
			property = findProperty(text);
		}
		if (property) {
			params = params.concat(text.split('&'));
			if (
				// GA4
				params.includes('en=page_view') ||
				// UA
				params.includes('t=pageview')
			) {
				handlePageViewForProperty(event.clientId, property);
			}
		}
	}
});


/* Source wp-caching-routes: */
wp.serviceWorker.routing.registerRoute( new RegExp( "^https\\:\\\/\\\/hechingerreport\\.org\\\/wp\\-includes\\\/.*" ), new wp.serviceWorker.strategies[ "NetworkFirst" ]( ( function() {const strategyArgs = {"cacheName":"core-assets"};if ( strategyArgs.cacheName && wp.serviceWorker.core.cacheNames.prefix ) { strategyArgs.cacheName = `${wp.serviceWorker.core.cacheNames.prefix}-${strategyArgs.cacheName}`; }strategyArgs.plugins = [new wp.serviceWorker[ "expiration" ][ "ExpirationPlugin" ]( {"maxEntries":14} )];return strategyArgs;} )() ) );wp.serviceWorker.routing.registerRoute( new RegExp( "^(https\\:\\\/\\\/hechingerreport\\.org\\\/wp\\-content\\\/themes\\\/newspack\\-theme\\\/|https\\:\\\/\\\/hechingerreport\\.org\\\/wp\\-content\\\/themes\\\/newspack\\-nelson\\\/).*" ), new wp.serviceWorker.strategies[ "NetworkFirst" ]( ( function() {const strategyArgs = {"cacheName":"theme-assets"};if ( strategyArgs.cacheName && wp.serviceWorker.core.cacheNames.prefix ) { strategyArgs.cacheName = `${wp.serviceWorker.core.cacheNames.prefix}-${strategyArgs.cacheName}`; }strategyArgs.plugins = [new wp.serviceWorker[ "expiration" ][ "ExpirationPlugin" ]( {"maxEntries":34} )];return strategyArgs;} )() ) );wp.serviceWorker.routing.registerRoute( new RegExp( "^https\\:\\\/\\\/hechingerreport\\.org\\\/wp\\-content\\\/plugins\\\/.*" ), new wp.serviceWorker.strategies[ "NetworkFirst" ]( ( function() {const strategyArgs = {"cacheName":"plugin-assets"};if ( strategyArgs.cacheName && wp.serviceWorker.core.cacheNames.prefix ) { strategyArgs.cacheName = `${wp.serviceWorker.core.cacheNames.prefix}-${strategyArgs.cacheName}`; }strategyArgs.plugins = [new wp.serviceWorker[ "expiration" ][ "ExpirationPlugin" ]( {"maxEntries":44} )];return strategyArgs;} )() ) );wp.serviceWorker.routing.registerRoute( new RegExp( "^https\\:\\\/\\\/hechingerreport\\.org\\\/wp\\-content\\\/uploads\\\/.*\\.(jpg|jpeg|jpe|gif|png|bmp|tif|tiff|ico|heic|heif|webp|avif)(\\?.*)?$" ), new wp.serviceWorker.strategies[ "StaleWhileRevalidate" ]( ( function() {const strategyArgs = {"cacheName":"uploaded-images"};if ( strategyArgs.cacheName && wp.serviceWorker.core.cacheNames.prefix ) { strategyArgs.cacheName = `${wp.serviceWorker.core.cacheNames.prefix}-${strategyArgs.cacheName}`; }strategyArgs.plugins = [new wp.serviceWorker[ "expiration" ][ "ExpirationPlugin" ]( {"maxAgeSeconds":2592000,"maxEntries":100} )];return strategyArgs;} )() ) );