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
const CACHE_VERSION = '2.1.0-beta2-v1';

// Never include these URLs in the SW cache.
const CACHE_EXCLUDE = [].map(function (r) {return new RegExp(r);});

// Cached pages. Add URLs using the 'Service Worker' tab of the Drupal UI.
let CACHE_URLS = ["\/offline","https:\/\/lemonbytes.nl\/sites\/default\/files\/pwa\/pwa-lemonbytes-logokopie.png","https:\/\/lemonbytes.nl\/sites\/default\/files\/pwa\/pwa-lemonbytes-logokopie_192x192.png","https:\/\/lemonbytes.nl\/sites\/default\/files\/pwa\/pwa-lemonbytes-logokopie_144x144.png"];

// Cached assets. These are extracted using internal HTTP requests during Drupal
// cache clears and this list will be hardcoded in the resultant SW file.
const CACHE_URLS_ASSETS = ["\/sites\/default\/files\/js\/optimized\/js_dxIVcwvQ00owLGoUGPTfRYXU-T5rnj8Xi0cXfb3Kn58._JqT3SQfawRcv_BIHPThkBvs0OEvtFFmqPF_lYI_Cxo.js?v=3.7.1","\/sites\/default\/files\/js\/optimized\/js_w0iO3No0CsyHgJmryEbhwpkh5zx6m6dhvawBt4ufwyA.HRN_m4FplP890kDvBJQuv0fEgTHDKwrMZA2zBldV1JY.js?v=1.0.1","\/sites\/default\/files\/js\/optimized\/js_7EV6A-vcqDWSntOSmj5tdyDgFJceGhO2b3AaBlVdBHk.FduA4OxwvoXNkEL_rS8qH78aN6lKCvSmU3wYRNhZpt4.js?smtkap","\/sites\/default\/files\/js\/optimized\/js_Hpe5jrMuKXrV4HSTMApXJsNBxraAgcHUrTjxkwWKqy8.9H1W9OQqD9V27idEVOJMCFAQtGS4Scq-gAQciKr0U2M.js?v=10.3.6","\/sites\/default\/files\/js\/optimized\/js_V1oRQ-kJlXBZaEklOtPUe_1t8-l0RS94HJ3gsqxKikc.LMtm7OsF5tFcpxpmBexOddu30l-Xz-FUCSBPovfiEt8.js?v=10.3.6","\/sites\/default\/files\/js\/optimized\/js_KRjtvzl6UujB23-j_sF6dqOcbqg2z8ej98A8RU9bGsg.kjk12BMQYgWzHTlTsh40oAfzJ1jsDD0rpt092h-M9uk.js?v=10.3.6","\/sites\/default\/files\/js\/optimized\/js_WmhavmnC0K35xZ9vLX51qtRqFT74puvZXIMWnNUYpbM.HmKlReEYCiV9GnfhxV81WuXqMJ6i6CJEQgYJrzlXRtw.js?v=6.2.0","\/sites\/default\/files\/js\/optimized\/js_PGDVt6NtC6bvyPqGkUUwCN2_ekhgE2MDPFTxjz22C-4.iuwqkXrvridcHK5DlJAbmypo-BN1pkXjVEj-VRuV6Ds.js?v=10.3.6","\/sites\/default\/files\/js\/optimized\/js_tztJTwOnNFMJJTbI9gE_qq84yDM-2o0keLxUqW_bE8I.KxroMN4x_pkiwNiseCxAXv_7E0af5AcdWUKbUXnNJyY.js?smtkap","\/sites\/default\/files\/js\/optimized\/js_5lyEgtuYzFbknt789sXbvgY6WOEBhn68zCRaGR5wIJc.pydd31qeaVwnZ7zmVFZER7RdslYTSa4L05Z96Bj0rpA.js?v=10.3.6","\/sites\/default\/files\/js\/optimized\/js_1woVuTYaOTc9db19BvtYERQ-r3zrWbaX8Iy9t_Z2qoM.pMTBYmavvxWwegzqwJmMmmYVLsQ3cxiWBi9yq_dxzNM.js?v=4.3.0","\/sites\/default\/files\/js\/optimized\/js_mjv4qhOv2_1-EQeYpZwvWqHcMokP3Cu36uHh9tRNXFY.CJF84Dv0PjH3KPaqgwzS-NJS45qPbXaVePB7UAw-uH8.js?v=10.3.6","\/sites\/default\/files\/js\/optimized\/js_ezwJb8QjKN82W11Y2widYXtFt5DfOo-fgZxIg_9sAik.5PSOH1VYJS66HSW-YKNaNaAkOQz0lw4GUrnmVPngMCs.js?v=10.3.6","\/sites\/default\/files\/js\/optimized\/js_G8podNJjOsxKvo_RVe4-f79_ME43boCp5OhhwF87kOc.CmHewv09bU-2iMTQUA9fYmgUfGdx8v6eCV0c0HTKVv0.js?v=10.3.6","\/sites\/default\/files\/js\/optimized\/js_RpLV1j1SEgkAOBNxIxvzKXRlefOlhPa03lpGt46bJEg.y1RLg0AG6UdwZTl8KBcxeodzdOA-NBscc_jl5UqoHHY.js?v=10.3.6","\/sites\/default\/files\/js\/optimized\/js_uRfUnsPtZNfw_JkQ6K1Hr_D4juhu2uqlMeE6dV3rt5k.iY0FoX8s_FEg3c26R6iFw3jAtGbzDwcA5QJ1fiS0A6E.js?v=1.x","\/sites\/default\/files\/js\/optimized\/js_OSGy-ixrPwnfgeaPL9qQjMUDIKvP6mhLpapDeRlN-J4.T3cxmgvV0fNMAzG-m1kWj1GvuXxTiEuZjVVKIOT2s6A.js?smtkap","\/sites\/default\/files\/js\/optimized\/js_WgyseRiC-OWI4vHJRxWldIN3Q6h_Y5uYyBmwBeN3zlk.vi_F1n1NKhoaJHvdmsHa0KVV9sPJNn3Tb0IxtqKictw.js?smtkap","\/modules\/contrib\/eu_cookie_compliance\/js\/eu_cookie_compliance.min.js?v=10.3.6","\/modules\/contrib\/google_tag\/js\/gtm.js?smtkap","\/modules\/contrib\/google_tag\/js\/gtag.js?smtkap","\/sites\/default\/files\/js\/optimized\/js_mFzUkjUxStqgHC8aG7xRbdL6fE1PCi6EiNgqsEIWhqc.AmJrN5cIvjCXoflH196uJrGsXtsbQ_h9Bbde81TlOtY.js?smtkap","\/sites\/default\/files\/js\/optimized\/js_0QHUpNqbA8fAMB3cn25pGmbtCxeFZPI32LhBTEqA3G4.ROo4GPlpIRgLVm1iIFIqJlpSzgkMmhxOruoe4ZdmC90.js?smtkap","\/sites\/default\/files\/css\/css_vsU0pwJ6vEuhTAUkRjNgh8THjP9TvDrBNVZJEdw_3q4.css?delta=0\u0026language=nl\u0026theme=drupal8_zymphonies_theme\u0026include=eJx1jUEOwjAMBD-UNld-EzmJaSOcOOo6oPJ6oAhxgctKM1ppYGQDoTJAC8Pj4OnDDjuMq48EdnkbneQU7nvtq7bCCLZyZR9VDbZR_39ZRCPJlLR2bdwMjkdIqpfC4SWlUEvsf8mQ-UxDzF0L3-CPnavmIew6bbQ8wyv8Oz1_zTxaH1EKVs4uCQG7b5r5AVWjYL0","\/sites\/default\/files\/css\/css_XeqPibIwXrTQfJzOY3vcoreRxOULhYPXLBBWnG8spas.css?delta=1\u0026language=nl\u0026theme=drupal8_zymphonies_theme\u0026include=eJx1jUEOwjAMBD-UNld-EzmJaSOcOOo6oPJ6oAhxgctKM1ppYGQDoTJAC8Pj4OnDDjuMq48EdnkbneQU7nvtq7bCCLZyZR9VDbZR_39ZRCPJlLR2bdwMjkdIqpfC4SWlUEvsf8mQ-UxDzF0L3-CPnavmIew6bbQ8wyv8Oz1_zTxaH1EKVs4uCQG7b5r5AVWjYL0","\/sites\/default\/files\/lemonbytes-logo-neg_0_0.png","\/sites\/default\/files\/styles\/paragraph_achtergrond_small\/public\/images\/website-achtergrond-default_23.jpg.webp?itok=HsODmk0t","\/sites\/default\/files\/styles\/medium\/public\/cta-afbeeldingen\/3D-man-thumbs-up_7.png?itok=mCHxe3KT","\/sites\/default\/files\/Drupal_Association_ind_member_64.png","\/sites\/default\/files\/sbb-erkend-leerbedrijf.png","\/sites\/default\/files\/nlgw-logo.png"];

// Active languages on the site.
const ACTIVE_LANGUAGES = ["nl","en","de"];

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
const SELF_SKIPWAITING = false;

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
