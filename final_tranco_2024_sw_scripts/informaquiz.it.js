/**
 * @file
 */

// If at any point you want to force pages that use this service worker to start
// using a fresh cache, then increment the CACHE_VERSION value in the Drupal UI.
// It will kick off the Service Worker update flow and the old cache(s) will be
// purged as part of the activate event handler when the updated Service Worker
// is activated.
//
// When Drupal replaces `cacheVersion` during server-side processing, it includes
// the packaged version number. That means any module upgrade will automatically
// result in a fresh SW installation.
/**
 * @todo fix JSDoc
 * @type {{offline: {image: string, page: string}, debug: boolean, assets: [], patterns: {page: []}, exclude: [], precache: {page: [], asset: []}, version: number}}
 */
const drupalPWASettings = {
    "version": "7.x-2.0-alpha2-v1",
    "debug": false,
    "cache": {
        "exclude": [
            "^\/admin\/.*",
            "^\/user\/reset\/.*",
            "^\/pwa\/.*"
        ],
        "precache": {
            "page": [
                "\/?source=pwa",
                "\/offline"
            ],
            "asset": [
                "https:\/\/informaquiz.it\/sites\/all\/modules\/pwa\/assets\/offline-image.png"
            ]
        },
        "patterns": {
            "page": [],
            "asset": []
        },
        "assets": {
            "image": {
                "strategy": "CacheFirst",
                "limitMaxSize": true,
                "maxSize": 350,
                "external": false
            },
            "script": {
                "strategy": "StaleWhileRevalidate",
                "limitMaxSize": false,
                "maxSize": 500,
                "external": true
            },
            "style": {
                "strategy": "StaleWhileRevalidate",
                "limitMaxSize": false,
                "maxSize": 300,
                "external": true
            },
            "font": {
                "strategy": "CacheFirst",
                "limitMaxSize": false,
                "maxSize": 1000,
                "external": true
            }
        },
        "offline": {
            "page": "\/offline",
            "image": "https:\/\/informaquiz.it\/sites\/all\/modules\/pwa\/assets\/offline-image.png"
        }
    },
    "phonehome": {
        "idle": 600,
        "count": 10
    }
};

importScripts('https://informaquiz.it/sites/all/modules/pwa/js/serviceworker/utils.js?v=7.x-2.0-alpha2');
importScripts('https://informaquiz.it/sites/all/modules/pwa/js/serviceworker/phonehome.js?v=7.x-2.0-alpha2');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js?v=7.x-2.0-alpha2');
importScripts('https://informaquiz.it/sites/all/modules/pwa/js/serviceworker/cache.js?v=7.x-2.0-alpha2');
importScripts('https://informaquiz.it/sites/all/modules/pwa/modules/pwa_webpush/js/serviceworker/notifications.js?v=7.x-2.0-alpha2');
