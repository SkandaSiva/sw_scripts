/**
 * Generic configuration for notifications (Site name, icon and badge)
 */
var siteName = "BursaTransport";
var siteIcon = "/themes/responsive/img/icons/logo-123cargo_192x192.png";
var siteBadge = "/themes/responsive/img/icons/badge-123cargo_white_72x72.png";

var matches = self.registration.scope.match(/(?:http[s]*\:\/\/)([a-z0-9\-\_\.]+)(?:\/)/i);

if (matches[1]) {
  switch (matches[1]) {
    case 'localhost.eu':
    case 'www.localhost.eu':
    case 'test.123cargo.eu':
    case '123cargo.eu':
    case 'www.123cargo.eu':
      siteName = "123cargo";
      siteIcon = "/themes/responsive/img/icons/logo-123cargo_192x192.png";
  }
}

// handle caching (WIP)
var cacheName = '123cargo-v1';
var filesToCache = [];
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
  // workbox.precaching.precacheAndRoute([
  //   '/',
  //   'https://fonts.googleapis.com/css?family=Montserrat:400,400i,500,600,700',
  //   '/site/aboutus/reftype/752',
  //   '/site/whyus/reftype/752'
  // ]);

  // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );

  // Cache the underlying font files with a cache-first strategy for 1 year.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
  );

  // workbox.routing.registerRoute(
  //   new RegExp('/themes/responsive/js/.*\.js'),
  //   workbox.strategies.networkFirst({
  //     cacheName: cacheName + '-js'
  //   })
  // );

  workbox.routing.registerRoute(
    new RegExp('/themes/responsive/css/.*\.css'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: cacheName + '-css'
    })
  );

  workbox.routing.registerRoute(
    new RegExp('/themes/responsive/fonts/'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: cacheName + '-fonts'
    })
  );

  workbox.routing.registerRoute(
    new RegExp('/themes/responsive/img/.*\.[png|gif|jpg|jpeg|svg]'),
    workbox.strategies.cacheFirst({
      cacheName: cacheName + '-img',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );
}

self.addEventListener('install', function (event) {
  console.log('[SW] Installing');
  self.skipWaiting()
});

self.addEventListener('activate', function (event) {
  console.log('[SW] Activating');
});
