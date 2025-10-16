/* eslint-disable */
/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * This file is manually generated, based on an auto-generated file from
 * gatsby-plugin-offline. It has been tweaked to not cache HTML pages so
 * redirects can work.
 */

importScripts('workbox-v4.3.1/workbox-sw.js');
workbox.setConfig({ modulePathPrefix: 'workbox-v4.3.1' });

workbox.core.setCacheNameDetails({ prefix: 'gatsby-plugin-offline' });

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    url: 'fonts/geographeditweb-regular.woff2',
    revision: '87416f2f31f98057c251249d8cbfda6e'
  },
  {
    url: 'fonts/geographeditweb-bold.woff2',
    revision: '579a9a0acbbeec263ada296a6ab6a8bd'
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(
  /^https?:\/\/static.*$/,
  new workbox.strategies.CacheFirst(),
  'GET'
);
workbox.routing.registerRoute(
  /^https?:\/\/fonts\.googleapis\.com\/css/,
  new workbox.strategies.StaleWhileRevalidate(),
  'GET'
);

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`);

let lastNavigationRequest = null;
let offlineShellEnabled = true;

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources));
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear());
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true;
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false;
  }
};

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data;
  if (api) MessageAPI[api](event, event.data);
});

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url);

  const params = pathname.match(/:(.+)/)[1];
  const data = {};

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`);
      data[key] = val;
    });
  } else {
    data.api = params;
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]();
  }

  if (!data.redirect) {
    return new Response();
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest
    }
  });
}

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest);
