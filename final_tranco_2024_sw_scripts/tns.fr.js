/**
 * @file
 * Adapted from https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker
 * and https://jakearchibald.com/2014/offline-cookbook/
 */
"use strict";

// If at any point you want to force pages that use this service worker to start
// using a fresh cache, then increment the CACHE_VERSION value in the Drupal UI.
// It will kick off the service worker update flow and the old cache(s) will be
// purged as part of the activate event handler when the updated service worker
// is activated.
//
// When Drupal replaces `cacheVersion` during server-side processing, it includes
// the packaged version number. That means any module upgrade will automatically
// result in a fresh SW installation.
const CACHE_VERSION = '2.1.0-beta5-v7';

// Never include these URLs in the SW cache.
const CACHE_EXCLUDE = ["admin\/.*","user\/.*","login\/.*","ticketing\/.*",".*\/api\/.*",".*\/ssks_api\/.*",".*\/concorde\/.*",".*\/main.umd.js",".*\/concorde.bundle.js",".*\/concorde-customer.bundle.js",".*\/kit.fontawesome.com\/.*",".*\/paygreen"].map(function (r) {return new RegExp(r);});

// Cached pages. Add URLs using the 'Service Worker' tab of the Drupal UI.
let CACHE_URLS = ["\/offline","https:\/\/tns.fr\/sites\/tns\/files\/pwa\/pwa.png","https:\/\/tns.fr\/sites\/tns\/files\/pwa\/pwa_192x192.png","https:\/\/tns.fr\/sites\/tns\/files\/pwa\/pwa_144x144.png"];

// Cached assets. These are extracted using internal HTTP requests during Drupal
// cache clears and this list will be hardcoded in the resultant SW file.
const CACHE_URLS_ASSETS = ["https:\/\/unpkg.com\/sonica11y\/dist\/sonica11y.js","\/\/billetterie.tns.fr\/concorde\/@customer","\/sites\/tns\/files\/js\/optimized\/js_dxIVcwvQ00owLGoUGPTfRYXU-T5rnj8Xi0cXfb3Kn58.z0j8rMeCtyBBVgiVvLe9XjUQ2Mttxyuhxr1g9ldL7u0.js?v=3.7.1","\/sites\/tns\/files\/js\/optimized\/js_w0iO3No0CsyHgJmryEbhwpkh5zx6m6dhvawBt4ufwyA.8txDkFCxyFemP32TwpCpp5gxh8-PXXDkDsPN1i6iUeA.js?v=1.0.1","\/sites\/tns\/files\/js\/optimized\/js_1dfaRspxH0NrFtlWwSdIBh8SkP07J7cyn-zV3mjEECM.M6aZZ43hN8IwZf7IRbCwczbglbQnpT81i927CZurn4I.js?smty18","\/sites\/tns\/files\/js\/optimized\/js_Hpe5jrMuKXrV4HSTMApXJsNBxraAgcHUrTjxkwWKqy8.9JsQAcM-UA0Ac6NCB0SqMGZu0AxdqlUEd_Z18xP7LQg.js?v=10.2.7","\/sites\/tns\/files\/js\/optimized\/js_V1oRQ-kJlXBZaEklOtPUe_1t8-l0RS94HJ3gsqxKikc.Yk5Ejrwq6GOBlyxTp1tuNHtuTpVuNVO8H1zzRvAa3Bg.js?v=10.2.7","\/sites\/tns\/files\/js\/optimized\/js_KRjtvzl6UujB23-j_sF6dqOcbqg2z8ej98A8RU9bGsg.-fKNyWPNf-7AvsqHxkkKfouZFhO4LH0Og2kN4UQoXLo.js?v=10.2.7","\/sites\/tns\/files\/js\/optimized\/js_WmhavmnC0K35xZ9vLX51qtRqFT74puvZXIMWnNUYpbM.rH6_rDsZ6oKkBBD6BF_QAwL2FgukdBRSm20WO72qXDI.js?v=6.2.0","\/sites\/tns\/files\/js\/optimized\/js_DNSWKRYVd9Zu7dmx6MSpO5fysApE9lWXbJLV2zF-UTk.zILpFgKYiYJsSV91rMawrm2nBTneuV9P6VUuSlxJpcY.js?v=1","\/sites\/tns\/files\/js\/optimized\/js_knxr15aR-oc4izul52VYCT6XhLPbkKrX4LM4cShCyRc.4UPN19NSYLcGA4gE4pMjQiQGPRS6ylnIsmgZGSdQ0g4.js?v=1","\/sites\/tns\/files\/js\/optimized\/js_PGDVt6NtC6bvyPqGkUUwCN2_ekhgE2MDPFTxjz22C-4.qr0rZ6JwsHWOjO7PAvxOO5nbN3wvpD_JOYP8fdpTY8Y.js?v=10.2.7","\/\/cdn.jsdelivr.net\/npm\/tarteaucitronjs@1.18.0\/tarteaucitron.min.js","\/sites\/tns\/files\/js\/optimized\/js_mlIlgXYmSTPLQWBmfHbQOh4CoBbVZBG1uw7vvxY58Ng.ddWBCU93bGYEl5meTf8-6O4QIJuUo-COFygnmU0M46k.js?v=1.x","\/sites\/tns\/files\/js\/optimized\/js_U9-qFOSX5QlHaXVEcnRcVWs-Yr7aYC6-PMFnXzl3Cic.ghj_0yOGLCSFCoyrUrkCEC_fzXFD0eXb8UfvOdKl_zM.js?smty18","\/sites\/tns\/files\/js\/optimized\/js_5lyEgtuYzFbknt789sXbvgY6WOEBhn68zCRaGR5wIJc.np5Cze1LZ-QAv5PAvkEbpcfdzruwTbaLefNy8eCxw1w.js?v=10.2.7","\/sites\/tns\/files\/js\/optimized\/js_1woVuTYaOTc9db19BvtYERQ-r3zrWbaX8Iy9t_Z2qoM.lxC8riCMK7Two9SquM25iCk40_MWBWOTGD6n8mRNsfk.js?v=4.2.0","\/sites\/tns\/files\/js\/optimized\/js_mjv4qhOv2_1-EQeYpZwvWqHcMokP3Cu36uHh9tRNXFY.UEX0yJ_cjBADiXu4lvg1zimRJSme72DGgd3p_nJU1I0.js?v=10.2.7","\/sites\/tns\/files\/js\/optimized\/js_ezwJb8QjKN82W11Y2widYXtFt5DfOo-fgZxIg_9sAik.rsplkpbgzCyn9urNvhrz-n0etEgjGZ1PU6yyp9cxPtY.js?v=10.2.7","\/sites\/tns\/files\/js\/optimized\/js_G8podNJjOsxKvo_RVe4-f79_ME43boCp5OhhwF87kOc.N2q-sl321LKXdxTLahCnjW7vBMOtciY-C7GDsQDQbWo.js?v=10.2.7","\/sites\/tns\/files\/js\/optimized\/js_RpLV1j1SEgkAOBNxIxvzKXRlefOlhPa03lpGt46bJEg.smzqNzOlRkr3sQGZLYp9F_RIYKEGAKRtpVZcKfzVGxQ.js?v=10.2.7","\/sites\/tns\/files\/js\/optimized\/js_kJydHFLllPsAmG8P39Dl-DwwWIGw6pdja_JDdjCpxIo.ugHqIRI_Y4QpHyRqCvOP7NTAt3TZk3neGGabT5p_xb0.js?smty18","\/sites\/tns\/files\/js\/optimized\/js_JGTm2EODaAwMKj0x9tbTMwK63iDa6wdFRNV_CNfELU4.8vxX5RRi5CF4eP8ybG072CAyIOzAG5TPwV1i3xfit5Q.js?smty18","\/\/kit.fontawesome.com\/f6e0878f0c.js","\/sites\/tns\/files\/js\/optimized\/js_ukpX6KSjCiybKz3BRsdHz3sKJOO0rkQC6qymhNb4t90.NkpIQmrG6vW3wvUvlr2--2CH8ZAEZKFuluM65SEoRxo.js?smty18","\/sites\/tns\/files\/css\/optimized\/css_4hidKybnABiv9R7fmJLhLK5qLUeqhVAoKxNH0WcRWi8.cCjI4SZhLtNl8FbM-AhK7t3NsE5QgfUdvDkzfvN1h_s.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_wdU0Pmg2iM5-oHy3qKh_6KT4D0j4JV6EWWAk27DlDLU.BQcrGTEzSkP7mNZBbnuR1Sr58MIxH4hIdMuphN9AoTU.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_QFP1hM7WLcxcgk0ugO8g07Igkb2TVVC-zTOOyNcyODA.cnSpyRP0j4KBG6SJevMYIbq0BeOPJxEsOCjg-gxnJ4A.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_sAPjjGEjjtN3kbFWkkCGFhD6oD1RmrhnSMI0bYBiQkg.U5tNqfjQledJ6TlYn891uMJwNIw3Vl3r-E9bK4RYuEQ.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_0Ny4cdKqSdUCVJGF2wOpW9zbiddbbZXY8WkM_XJpnL8.JCtPgw0t1QMKSriJSMIq7E-EEiPMLXqhddocQqft0ag.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_x_4HIN6y5Q2mTk5Yv7JQVdc-r71A0bNzHEv3Wizcouw.DWXyHuoNcCT6FD81wSkJjyPpslZ4bP-rGUMX1OffCWw.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_UmAqJl0l8Iyu6ze5RyEPgBE6SIIewruIiHw0myxraZk.MF7cF-xfbDcQshvhMQTQ9f8pturs5RjCKC8Ch35aSJg.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_9fdY-kLwoAH17IT6ViP47CdYfbBMwZBp0UTWz5W6WdM.YL3AI4FXReRXeKk-3Q4Lb9mUAWJOPTN-mxDfhetCpR8.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_C_lMMBJD1jF8Lb4t-73z0zLIGmrUIjBn8oLQ4yu2-LA.a6Q7KmzEgm2SslPe-vbYWofKTF53-hBealMjO_Yu3V4.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_M3EqtkMzY2VXZ2NYDaMtpuqydcZtOVwPzc4s-713RoE.1WTDHWorVn86lc2_oa3RTcePtmK9Yd_UevhPRay9dog.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_aBslj4pRjo2Mfa9bpGonfypZX7vip8qq6TxMpLA7zrQ.0FoSu3z4EhRrmgLrbnjCQLCaleZFvf0QI8cY72P4PgE.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_T9L-umrTsij_ahYGC4lMPKYDekA_3aSaQXOcPGy8mnU.HaUtqzGYKwBb2IDtH2KMpQzdLqjl0W9jKICQGnXdmZo.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_f-FSNaPTrP2oOQFtOvYzYmkaLNTjVtdiigX0p_xUQR0.gpEXxMYYSdh8QJKheZ-qQiOn1JMGbjVgvgHfemd8ya0.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_8HmzQSCJVYE4q35-lWsN1tEslmetnp8LEje1u-O2Cig.CO_UyLfgwxXTSXf6rDbYV-rbrWUPrH7XvORQ0Ix2r8U.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_-bRO5lMsX6dFj_4QLNYRn3Glv8Fw-sjQmtuCC3SCdE0.ynmRK_kaOa8DvsBDyMGdm4neIGk9ryJzZbAc91usHu0.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_kthmJssD3vqd7Eza4oWjPfCNVacwCRLi2v-oieNlGgU.PlvkJkT_9E59HvxzcUL9L6AyI8kW1kHKKbavCnR1Q2I.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_AJzZgfMtk5tgbHEtGc1NLS6mxtGjcIeWMDKRdWVuOBc.t2palHUHygWCkeSOPg0TQIcnuo0qKbFIcurCsgXuS1A.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_m_oZWVRbbC4HbOitJcwhEovlJf07D1q3gXxNcR04IzI.GgMPTPsmnqM3_id7z6Fs8yFGxuhheJ0sVhbUoL8kdBE.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_YXF4xgOS0zk23OCyVsSDTus82BFUbBkYr_ItOXVj81E.c6ZxXJPGg9WX0OmeOQ3HcYYNJIEYwPEPCIlOUzWIg6o.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_kMOSxvLIrg4Hy0ZeT-Rnxv9lZTob-7Yn3A8dyVDo1rg.j5u8eP8wgHm7KI0IjSVH3vePpnZwnSVSlAYIWSZcrMM.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_bqyqR963OSUJ37smsMj1mqW8feho4HD2gKDrmTJGSUg.yUOR3ZlNnpbpT35LszQg6yJkqPhEoSCeVyTyjaLIKRc.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_AMTsGHUOJPFAkMMKM4W6IN1gVpB5oWWwJRMkxKq51pw.0xVaBbgdYsnuYx6kUe0_FfVoIzrPRbIZ9_VUISRMDyQ.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_a6cSVfe3KsStesqX32HnaCqF74WAMBQ1Bv-o2-voWnI.dr9t19yQIYqZWi1zqxBIQZQabRoinz1CazUGk2nq5d4.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_e9jMIDOBcJS7AVs_sPvFR4Zzthg1ccrIHxa7f86xDOI.iDI5Pl6-nN8Yfe5DX3KxVcaE2Ta66J-ViTMnb8vdv8A.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_pp1mROBRU01YNyoQP1F23-Bm2uQN-ftFYJy5tvm0-Ts.GLMlsmIsyLLujNf1WuvnegGfx7efZFaa9HxbwYO_Vso.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_qZD_BU3Hjrbfg8suPYrS00HTFLxw7tcmTCbNgas6bb8.G0gPn-Se1gmWY_0Za9Vxnmh7j7IsqVIcxWW_IqkSW24.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_HyhB0fihjs_08nXEGXddPFbgOiOm1lsN-fqCKatPYo8.mx8qsxm5P4lC6QpCLztEDF_1PRt6omWkTQcZYU2pVuM.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_1Vmczv4_-S4mTHkLRFtsdl8PQwFzcyE6XRtz8wOWV0A.MyDTlbJjKSxug0prwn-NgGyedRbUb02xKrVrWNWVDcw.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_cKSaVJ4c0udvjx8_ZzsNiEFIbup6NxkBg3XxvJ_Y_xo.KUURFMiFcfiNKmHgGXnr-zH_u1fJXuW51U_gf_7q1sk.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_Sl1vdK9TFb1CZsVSkkHEkRlJqMaSz3JxdGtW2ZwJeHo.Bw0yGS2h04WBAlN4N81yqR0ibdmNB4snUk-TWsBvMI0.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_lQ7CW8o3nK31YYGGdhSVoLQw6d6BGqnd_Ng_1P20Kp8.LXzIPEB2r5y0QbIF_MugJWz8Dpq7OLXe3KnBh2bqV4g.css?smty18","\/sites\/tns\/files\/css\/optimized\/css_fPsxnqcSEqgoVZkykkMOlCxzrvX6mgzfh4adf7QEvDk.syY9ouTPeoEVBqYHV8Zvhwl87jKBsPOLly3AtQZvnqk.css?smty18"];

// Active languages on the site.
const ACTIVE_LANGUAGES = ["fr","en"];

// When no connection is available, show this URL instead of the content that
// should be available at the URL. This URL is never shown in the browser.
const CACHE_OFFLINE = '/offline';

// When an image hasn't been cached, we use this fallback image instead.
const CACHE_OFFLINE_IMAGE = '/modules/contrib/pwa/modules/pwa_service_worker/assets/offline-image.png';

// Add critical offline URLs to the required asset list. (The offline page is
// already part of CACHE_URLS.)
CACHE_URLS.push(CACHE_OFFLINE_IMAGE);

// Cache prefix.
const CACHE_PREFIX = 'pwa-main-';

// Full cache name: Cache prefix + cache version.
const CACHE_CURRENT = CACHE_PREFIX + CACHE_VERSION;

// The cache should be assumed to be active by default. After uninstallation has
// successfully occurred we will set this to false in order to prevent certain
// conditions where the cache was deleted before new assets were added afterwards.
let CACHE_ACTIVE = true;

// Phone-home URL.
const PWA_SERVICE_WORKER_PHONE_HOME_URL = '/pwa/phone-home';

// Phone-home should only happen once per life of the SW. This is initialized to
// FALSE and will be set to TRUE during phone-home. When the service worker goes
// idle it will reset the variable and the next time it activates, it will once
// again phone-home.
let PWA_SERVICE_WORKER_PHONE_HOME_ALREADY = false;

// If enabled, an updated service worker will not wait, but instead activates as
// soon as it's finished installing.
const SELF_SKIPWAITING = true;

/**
 * Install the service worker.
 *
 * This event runs only once for the entire life of the active SW. It will run
 * again once the value of CACHE_CURRENT changes, OR when the contents of this
 * file change in any way.
 */
self.addEventListener('install', function (event) {
  if (SELF_SKIPWAITING) {
    self.skipWaiting();
  }
  // Install assets for minimum viable website (MVW).
  if (CACHE_URLS.length) {
    event.waitUntil(caches
      .open(CACHE_CURRENT)
      .then(function (cache) {
        return Promise.all(CACHE_URLS.concat(CACHE_URLS_ASSETS).map(function (url) {
          // Instead of directly adding URLs to Cache API, reformat to include
          // the `no-cors` header to enable caching of third-party assets such
          // as hosted fonts, CDN libraries, etc.
          return fetch(url, { credentials: 'same-origin', mode: 'no-cors' })
            .then(function (response) {
              return cache.put(url, response);
            })
            .catch(function (error) {
              logError(error);

              // Uncommented Promise.resolve() will allow installation even when
              // assets aren't successfully cached.
              //
              // @TODO: is this conservative enough for a module expected to work
              //        without extensive configuration?
              //
              // @see https://www.drupal.org/project/pwa/issues/2986596
              //
              // return Promise.resolve();
            });
        }));
      }));
  }
});

/**
 * Once the Service Worker is installed, this event is fired to allow for
 * cleanup of the old caches and to prime the service worker for use.
 */
self.addEventListener('activate', function (event) {
  // The `activate` event happens in one of two situations:
  // 1) The service worker successfully installed and the visitor finished their
  //    previous session, allowing this current SW to claim control, OR...
  // 2) When during the `install` event, we execute the `self.skipWaiting()`
  //    command to immediately pass control to the new SW as soon as it finishes
  //    installing.
  //
  // The tasks we perform are:
  //
  // 1) Activate new service worker and take control of the client(s).
  // 2) Delete all caches that are not CACHE_CURRENT.
  var tasks = [
    self.clients.claim(),
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          // Delete any cache that...
          // 1) has our prefix at the beginning
          // 2) doesn't exactly match CURRENT_CACHE
          //
          // We intentionally skip other caches that lack our hardcoded prefix
          // in order to allow custom Cache entries from userland.
          //
          // @see https://www.drupal.org/project/pwa/issues/2984140
          if (cacheName.indexOf(CACHE_PREFIX) === 0 && cacheName.indexOf(CACHE_CURRENT) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  ];

  // Execute the tasks defined above.
  event.waitUntil(Promise.all(tasks));
});

/**
 * @TODO move that when we start using plugins.
 *
 * @param {string} url
 *
 * @return {Function}
 */
function urlNotExcluded(url) {
  return function (condition) {
    return !condition.test(url);
  }
}

/**
 * Returns request language prefix.
 *
 * @param {object} request
 *
 * @return {string}
 */
function getLanguagePathPrefix(request) {
  const url = new URL(request.url);

  for (let langcode of ACTIVE_LANGUAGES) {
    if (url.pathname.startsWith(`/${langcode}`)) {
      return `/${langcode}`;
    }
  }
  return '';
}

/**
 * Default offline page.
 *
 * @param {object} error
 * @param {object} request
 *
 * @return {Response}
 */
function catchOffline(error, request) {
  const pathPrefix = getLanguagePathPrefix(request);
  return caches.match(`${pathPrefix}${CACHE_OFFLINE}`);
}

/**
 * Default offline Image.
 *
 * @param {object} error
 *
 * @return {Response}
 */
function catchOfflineImage(error) {
  return caches.match(CACHE_OFFLINE_IMAGE);
}

/**
 * Default catch callback.
 *
 * @param {Error} error
 */
function logError(error) {
  console.error(error);
  return Response.error();
}

/**
 * Test if an asset should be cached.
 *
 * @param {URL} assetUrl
 *
 * @return {boolean}
 */
function isCacheableAsset(assetUrl) {

  // URL is not an asset, don't cache.
  if (!isAssetUrl(assetUrl)) {
    return false;
  }

  // It's an asset but not an image, always cache.
  if (!isImageUrl(assetUrl)) {
    return true;
  }

  // If it looks like an image, only cache images that are part of
  // assets cached on install.
  var assetPath = assetUrl.href.replace(assetUrl.origin, '');
  return CACHE_URLS.concat(CACHE_URLS_ASSETS).some(function (url) { return assetPath === url; });
}

/**
 * Helper for Assets files.
 *
 * @param {URL} assetUrl
 *
 * @return {boolean}
 */
function isAssetUrl(assetUrl) {
  return /\.(js|css|jpe?g|png|gif|svg|webp|eot|woff2?|ttf|otf)\??/i.test(assetUrl.href);
}

/**
 * Helper for image files.
 *
 * @param {URL} imageUrl
 *
 * @return {boolean}
 */
function isImageUrl(imageUrl) {
  return /\.(jpe?g|png|gif|svg|webp)\??/i.test(imageUrl.href);
}

/**
 * Mix of several strategies:
 * - only cache GET requests.
 * - CSS/JS/fonts use stale while revalidate.
 * - HTML responses use network with cache fallback.
 * - Images use stale while revalidate unless `save-data` header is present
 * - Do NOT cache HTTP errors and redirects.
 */
self.addEventListener('fetch', function (event) {

  // Disable service worker on localhost
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.includes('172.18.0')) {
    return;
  }

  // During every request give SW the chance to phone-home and unregister.
  phoneHome();

  /**
   * @param {Request} request
   *
   * @return {Promise}
   */
  function fetchResourceFromCache(request) {
    return caches.match(request.url ? request : event.request);
  }

  /**
   * Returns the cached version or reject the promise.
   *
   * @param {undefined|Response} response
   *
   * @return {Promise}
   */
  function returnResourceFromCache(response) {
    if (!response) {
      return Promise.reject(new Error('Resource not in cache'));
    }
    return response;
  }

  /**
   *
   * @return {Promise}
   */
  function fetchResourceFromNetwork() {
    return fetch(event.request);
  }

  /**
   * @param {Response} response
   *
   * @return {Promise}
   */
  function cacheNetworkResponse(response) {

    var notExcludedPath = CACHE_EXCLUDE.every(urlNotExcluded(url.href));

    if (notExcludedPath) {
      // Don't cache redirects or errors.
      if (response.ok) {
        // Copy now and not in the then() because by that time it's too late,
        // the request has already been used and can't be touched again.
        var copy = response.clone();

        if (CACHE_ACTIVE) {
          caches
            .open(CACHE_CURRENT)
            .then(function (cache) {
              return cache.put(event.request, copy);
            })
            .catch(logError);
        } else {
          console.debug('PWA: The service worker has been uninstalled so cache.put() was skipped.');
        }
      }

      // If response.ok was false, try one more time with `no-cors` header which
      // will allow valid third-party requests to be cached.
      else {
        fetch(event.request, {mode: 'no-cors'})
          .then(function (response) {
            // Don't cache redirects or errors.
            if (response.ok) {
              var copy = response.clone();

              if (CACHE_ACTIVE) {
                caches
                  .open(CACHE_CURRENT)
                  .then(function (cache) {
                    return cache.put(event.request, copy);
                  })
                  .catch(logError);
              } else {
                console.debug('PWA: The service worker has been uninstalled so cache.put() was skipped.');
              }
            }
          })
          .catch(function (error) {
            logError(error);
            console.error("PWA: Response not cacheable ", response);
          });
      }
    }
    return response;
  }

  var url = new URL(event.request.url);
  var isMethodGet = event.request.method === 'GET';
  var notExcludedPath = CACHE_EXCLUDE.every(urlNotExcluded(url.href));
  var includedProtocol = ['http:', 'https:'].indexOf(url.protocol) !== -1;

  var makeRequest = {
    networkWithOfflineImageFallback: function (request) {
      return fetch(request)
        .catch(catchOfflineImage)
        .catch(logError);
    },
    staleWhileRevalidate: function (request) {
      return fetchResourceFromCache(request)
        .then(returnResourceFromCache)
        .catch(function (error) {
          return fetchResourceFromNetwork(error)
            .then(cacheNetworkResponse);
        })
        .catch(logError);
    },
    staleWhileRevalidateImage: function (request) {
      return fetchResourceFromCache(request)
        .then(returnResourceFromCache)
        .catch(function (error) {
          return fetchResourceFromNetwork(error)
            .then(cacheNetworkResponse)
            .catch(catchOfflineImage);
        })
        .catch(logError);
    },
    networkWithCacheFallback: function (request) {
      return fetch(request)
        .then(cacheNetworkResponse)
        .catch(function (error) {
          return fetchResourceFromCache(error)
            .then(returnResourceFromCache)
            .catch((error) => catchOffline(error, request));
        });
    }
  };

  // Make sure the URL is one we don't exclude from cache.
  if (isMethodGet && includedProtocol && notExcludedPath) {
    // If it's an asset: Stale-While-Revalidate.
    if (isCacheableAsset(url)) {
      event.respondWith(makeRequest.staleWhileRevalidate(event.request));
    }
    // Check for save-data Header and avoid caching when present.
    else if (isImageUrl(url)) {
      if (event.request.headers.get('save-data')) {
        console.debug('PWA: refusing to cache image due to save-data header.');
        event.respondWith(makeRequest.networkWithOfflineImageFallback(event.request));
      }
      else {
        event.respondWith(makeRequest.staleWhileRevalidateImage(event.request));
      }
    }
    else if (!isCacheableAsset(url)) {
      // This networkWithCacheFallback does not work with excluded paths.
      event.respondWith(makeRequest.networkWithCacheFallback(event.request));
    }
  }
  else {
    if (isMethodGet && includedProtocol && !notExcludedPath) {
      // This networkWithCacheFallback works only with excluded paths.
      event.respondWith(makeRequest.networkWithCacheFallback(event.request));
    }
    console.debug('PWA: Excluded URL', event.request.url);
  }
});


/**
 * Phone home
 *
 * Check and see if the Drupal module still exists. The module specifies a
 * dedicated path and when the module is disabled or uninstalled, the URL
 * will 404, signalling to the SW that it needs to unregister itself.
 */
function phoneHome() {
  // Avoid constant phoning-home. Once this function has run, don't run again
  // until SW goes idle.
  if (PWA_SERVICE_WORKER_PHONE_HOME_ALREADY) {
    console.debug('PWA: Phone-home - Last check was recent. Aborting.');
    return Promise.resolve();
  }
  else {
    // Enable flag to suppress future phone-homes until SW goes idle.
    PWA_SERVICE_WORKER_PHONE_HOME_ALREADY = true;
  }

  // Fetch phone-home URL and process response.
  fetch(PWA_SERVICE_WORKER_PHONE_HOME_URL)
    .then(function (response) {
      // if no network, don't try to phone-home.
      if (!navigator.onLine) {
        console.debug('PWA: Phone-home - Network not detected.');
      }

      // If network + 200, do nothing.
      if (response.status === 200) {
        console.debug('PWA: Phone-home - Network detected, module detected.');
      }

      // If network + 404, uninstall.
      if (response.status === 404) {
        console.debug('PWA: Phone-home - Network detected, module NOT detected. UNINSTALLING.');

        // Let SW attempt to unregister itself.
        Promise.resolve(pwaUninstallServiceWorker());
      }

      return Promise.resolve();
  })
  .catch(function(error) {
    console.error('PWA: Phone-home - ', error);
  });
};

/**
 * Uninstall service worker.
 */
function pwaUninstallServiceWorker() {
  return self.registration.unregister()
  .then(function(success) {
    if (success) {
      // Delete all Caches that belong to the PWA module.
      caches.keys().then(function(names) {
        for (let name of names) {
          console.debug('cache name: ', name);
          if (name.indexOf(CACHE_PREFIX) !== -1) {
            console.debug('PWA: Deleting cache with name ', name);
            caches.delete(name);
          }
        }

        // Disallow any future cache.put() coming from fetch listeners.
        CACHE_ACTIVE = false;

        console.debug('PWA: Phone-home - Service worker has unregistered itself and destroyed old caches since the PWA Drupal module could not be detected.');
      });
    }
    else {
      console.error('PWA: Phone-home - Service worker could not unregister itself. It might be necessary to manually delete this service worker using browser devtools.');
    }
  })
  .catch(function(error) {
    console.error('PWA: Phone-home - ', error);
  });
}
