/* global workbox, importScripts, self */
/* eslint-disable no-underscore-dangle, no-restricted-globals */
/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.2/workbox-sw.js')

// Blink
importScripts('/blink-sw.js')

const minute = 60
const hour = 60 * minute
const day = 24 * hour
const month = 31 * day
const year = 365 * day

workbox.routing.registerRoute(
  /^https:\/\/fonts.gstatic.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'gstatic',
    plugins: [new workbox.cacheableResponse.Plugin({ statuses: [0, 200] })],
  }),
  'GET',
)
workbox.routing.registerRoute(
  /\/_next(?!\/static\/prebid-)\//,
  workbox.strategies.cacheFirst({
    cacheName: '_next',
    plugins: [
      new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
      new workbox.expiration.Plugin({ maxEntries: 200, maxAgeSeconds: month }),
    ],
  }),
  'GET',
)
workbox.routing.registerRoute(
  /^https:\/\/personvern.aller.no\/vendorlist.json/,
  workbox.strategies.cacheFirst({
    cacheName: 'vendorlist',
    plugins: [
      new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
      new workbox.expiration.Plugin({ maxEntries: 100, maxAgeSeconds: month }),
    ],
  }),
  'GET',
)
workbox.routing.registerRoute(
  /^https:\/\/am.medialaben.no\/scripts\/prebid.*/,
  workbox.strategies.cacheFirst({
    cacheName: 'prebid-currency',
    plugins: [
      new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
      new workbox.expiration.Plugin({ maxEntries: 100, maxAgeSeconds: day }),
    ],
  }),
  'GET',
)
workbox.routing.registerRoute(
  /^https:\/\/currency.prebid.org\/latest.json/,
  workbox.strategies.cacheFirst({
    cacheName: 'prebid-currency',
    plugins: [
      new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
      new workbox.expiration.Plugin({ maxEntries: 1, maxAgeSeconds: day }),
    ],
  }),
  'GET',
)
workbox.routing.registerRoute(
  /^https:\/\/personvern.aller.no\/vendorlist.json/,
  workbox.strategies.cacheFirst({
    cacheName: 'vendorlistCache',
    plugins: [
      new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
      new workbox.expiration.Plugin({ maxEntries: 1, maxAgeSeconds: year }),
    ],
  }),
  'GET',
)

/* New Labrador */
workbox.routing.registerRoute(
  /^\/(_chunks|_fonts|view-resources|assets)\//,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'labrador',
    plugins: [
      new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
      new workbox.expiration.Plugin({ maxEntries: 200, maxAgeSeconds: month }),
    ],
  }),
  'GET',
)

/* Google store */
workbox.routing.registerRoute(
  /^https:\/\/storage.googleapis.com\/\S+-assets/,
  workbox.strategies.cacheFirst({
    cacheName: 'googleStore',
    plugins: [
      new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: month,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  'GET',
)

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

