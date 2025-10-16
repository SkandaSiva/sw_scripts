/* PWA v0.7.1-front */

/* Note: This file is dynamically generated. To manipulate the contents of this file, use the `wp_front_service_worker` action in WordPress. /*


/* Source wp-base-config: */
!function(){"use strict";try{self["workbox:sw:6.5.3"]&&_()}catch(t){}const t={backgroundSync:"background-sync",broadcastUpdate:"broadcast-update",cacheableResponse:"cacheable-response",core:"core",expiration:"expiration",googleAnalytics:"offline-ga",navigationPreload:"navigation-preload",precaching:"precaching",rangeRequests:"range-requests",routing:"routing",strategies:"strategies",streams:"streams",recipes:"recipes"};self.workbox=new class{constructor(){return this.v={},this.Pt={debug:"localhost"===self.location.hostname,modulePathPrefix:null,modulePathCb:null},this.$t=this.Pt.debug?"dev":"prod",this.Ct=!1,new Proxy(this,{get(e,s){if(e[s])return e[s];const o=t[s];return o&&e.loadModule("workbox-"+o),e[s]}})}setConfig(t={}){if(this.Ct)throw new Error("Config must be set before accessing workbox.* modules");Object.assign(this.Pt,t),this.$t=this.Pt.debug?"dev":"prod"}loadModule(t){const e=this.jt(t);try{importScripts(e),this.Ct=!0}catch(s){throw console.error(`Unable to import module '${t}' from '${e}'.`),s}}jt(t){if(this.Pt.modulePathCb)return this.Pt.modulePathCb(t,this.Pt.debug);let e=["https://storage.googleapis.com/workbox-cdn/releases/6.5.3"];const s=`${t}.${this.$t}.js`,o=this.Pt.modulePathPrefix;return o&&(e=o.split("/"),""===e[e.length-1]&&e.splice(e.length-1,1)),e.push(s),e.join("/")}}}();
workbox.setConfig( {"debug":false,"modulePathPrefix":"https:\/\/www.loksatta.com\/wp-content\/plugins\/pwa\/wp-includes\/js\/workbox-v6.5.3\/"} );
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
 wp.serviceWorker.precaching.precache([{"url":"https:\/\/www.loksatta.com\/?wp_error_template=offline","revision":"0.7.1;ie-network-theme=1.0.0;options=413de577580ac01ace7bad1c3b21708d;nav=bf3466e9d056f626b50025fc8b136b89;deps=eb9fb405a969880de7fe5164a89a80f0;974472092a3d0d0440789253032d4714"},{"url":"https:\/\/www.loksatta.com\/?wp_error_template=500","revision":"0.7.1;ie-network-theme=1.0.0;options=413de577580ac01ace7bad1c3b21708d;nav=bf3466e9d056f626b50025fc8b136b89;deps=eb9fb405a969880de7fe5164a89a80f0;ceb1195e210a9098343a94a3573bac8e"}]);

 // @todo Should not these parameters be specific to each entry as opposed to all entries?
 // @todo Should not the strategy be tied to each entry as well?
 // @todo Use networkFirst instead of cacheFirst when WP_DEBUG.
 wp.serviceWorker.precaching.addRoute({
 ignoreUrlParametersMatching: [/^utm_/, /^wp-mce-/, /^ver$/],
 // @todo Add urlManipulation which allows for the list of ignoreUrlParametersMatching to be supplied with each entry.
 });
})();


/* Source ie-moengage-workers: */
importScripts("https://cdn.moengage.com/webpush/releases/serviceworker_cdn.min.latest.js");