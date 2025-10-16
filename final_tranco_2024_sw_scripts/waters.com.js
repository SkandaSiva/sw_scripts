/**
 * "Service Workers"  enables applications to control network requests, 
 * cache those requests to improve performance, and provide offline access
 *  to cached content.
*/

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.0/workbox-sw.js');

// Switch debug logging on/off here. Default is on in dev and off in prod.
workbox.setConfig({ debug: false });

// This clientsClaim() should be at the top level
// of your service worker, not inside of, e.g.,
// an event handler.
workbox.core.clientsClaim();

/**
 * We are not wrapping it in a 'message' event as per the new update.
 * @see https://developers.google.com/web/tools/workbox/modules/workbox-core
 */
self.skipWaiting();

/**
 * Use a stale-while-revalidate strategy for third party requests eg. decibel and type kit.
 */
const matchCb = ({ url: { href } }) => {
    return (href.indexOf('decibel') > 0 || href.indexOf('typekit') > 0 || href.indexOf('assets.adobedtm.com') > 0 || href.indexOf('cdn.cookielaw.org') > 0 || href.indexOf('code.jquery.com') > 0 || href.indexOf('connect.facebook.net') > 0 || href.indexOf('clientlib-react_prop_vendors') > 0 || href.indexOf('clientlib-vendors') > 0 || href.indexOf('mpulse') > 0 || href.indexOf('googletagmanager') > 0 || href.indexOf('cloudfront') > 0  || href.indexOf('clientlib-utility') > 0 || href.indexOf('clientlib-react_dom_vendors') > 0 || href.indexOf('decibelinsight') > 0 || href.indexOf('qualtrics') > 0 || href.indexOf('clientlib-site') > 0 || href.indexOf('adoberesources') > 0 || href.indexOf('clientlib-common') > 0 || href.indexOf('clientlib-tiles') > 0 || href.indexOf('clientlib-countrySelectorBar') > 0);
};
workbox.routing.registerRoute(
    matchCb,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'waters_third_party',
    })
);