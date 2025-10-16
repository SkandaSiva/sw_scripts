const CACHE_VERSION = 14;

const BASE_CACHE_FILES = [
    '/frontend/css/app.bundle.css',
    'https://fonts.googleapis.com/css?family=Material+Icons',
    '/frontend/scripts/vendors~app.bundle.js',
	'/frontend/scripts/app.bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.0.1/plugins/bgset/ls.bgset.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.0.1/lazysizes.min.js',
    '/frontend/favicon/manifest-de.json',
    '/frontend/favicon/apple-touch-icon.png',
    '/frontend/favicon/favicon-32x32.png',
    '/frontend/favicon/favicon-16x16.png',
    '/frontend/favicon/safari-pinned-tab.svg',
    '/frontend/favicon/favicon.ico'
];

const OFFLINE_CACHE_FILES = [
    '/frontend/css/app.bundle.css',
    'https://fonts.googleapis.com/css?family=Material+Icons',
    '/frontend/scripts/vendors~app.bundle.js',
	'/frontend/scripts/app.bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.0.1/plugins/bgset/ls.bgset.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.0.1/lazysizes.min.js',
    '/de/services/kontakt-beratung/offline',
    '/media/vtvjmjgj/404message1.jpg?center=0.49934315374869043,0.5&mode=crop&width=657&height=438',
    '/media/vtvjmjgj/404message1.jpg?center=0.49934315374869043,0.5&mode=crop&width=834&height=556'
];										  

const NOT_FOUND_CACHE_FILES = [
    '/frontend/css/app.bundle.css',
    'https://fonts.googleapis.com/css?family=Material+Icons',
	'/frontend/scripts/vendors~app.bundle.js',
    '/frontend/scripts/app.bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.0.1/plugins/bgset/ls.bgset.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.0.1/lazysizes.min.js',
    '/de/404-seite'
];

const OFFLINE_PAGE = '/de/services/kontakt-beratung/offline';
const NOT_FOUND_PAGE = '/de/404-seite';

const CACHE_VERSIONS = {
    assets: 'assets-v' + CACHE_VERSION,
    content: 'content-v' + CACHE_VERSION,
    offline: 'offline-v' + CACHE_VERSION,
    notFound: '404-v' + CACHE_VERSION,
};

// Define MAX_TTL's in SECONDS for specific file extensions
const MAX_TTL = {
    '/': 3600,
    html: 3600,
    json: 86400,
    js: 86400,
    css: 86400,
};

const CACHE_BLACKLIST = [
	(str) => {
		return !str.includes('umbraco#/') || !str.includes('/umbraco/login#/');
    }
];

const SUPPORTED_METHODS = [
    'GET',
];

/**
 * isBlackListed
 * @param {string} url
 * @returns {boolean}
 */
function isBlacklisted(url) {
    return (CACHE_BLACKLIST.length > 0) ? !CACHE_BLACKLIST.filter((rule) => {
        if (typeof rule === 'function') {
            return !rule(url);
        } else {
            return false;
        }
    }).length : false
}

/**
 * getFileExtension
 * @param {string} url
 * @returns {string}
 */
function getFileExtension(url) {
    let extension = url.split('.').reverse()[0].split('?')[0];
    return (extension.endsWith('/')) ? '/' : extension;
}

/**
 * getTTL
 * @param {string} url
 */
function getTTL(url) {
    if (typeof url === 'string') {
        let extension = getFileExtension(url);
        if (typeof MAX_TTL[extension] === 'number') {
            return MAX_TTL[extension];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

/**
 * installServiceWorker
 * @returns {Promise}
 */
function installServiceWorker() {
    return Promise.all(
        [
            caches.open(CACHE_VERSIONS.assets)
                .then(
                    (cache) => {
                        return cache.addAll(BASE_CACHE_FILES);
                    }
                ),
            caches.open(CACHE_VERSIONS.offline)
                .then(
                    (cache) => {
                        return cache.addAll(OFFLINE_CACHE_FILES);
                    }
                ),
            caches.open(CACHE_VERSIONS.notFound)
                .then(
                    (cache) => {
                        return cache.addAll(NOT_FOUND_CACHE_FILES);
                    }
                )
        ]
    )
        .then(() => {
            return self.skipWaiting();
        });
}

/**
 * cleanupLegacyCache
 * @returns {Promise}
 */
function cleanupLegacyCache() {

    let currentCaches = Object.keys(CACHE_VERSIONS)
        .map(
            (key) => {
                return CACHE_VERSIONS[key];
            }
        );

    return new Promise(
        (resolve, reject) => {

            caches.keys()
                .then(
                    (keys) => {
                        return legacyKeys = keys.filter(
                            (key) => {
                                return !~currentCaches.indexOf(key);
                            }
                        );
                    }
                )
                .then(
                    (legacy) => {
                        if (legacy.length) {
                            Promise.all(
                                legacy.map(
                                    (legacyKey) => {
                                        return caches.delete(legacyKey)
                                    }
                                )
                            )
                                .then(
                                    () => {
                                        resolve()
                                    }
                                )
                                .catch(
                                    (err) => {
                                        reject(err);
                                    }
                                );
                        } else {
                            resolve();
                        }
                    }
                )
                .catch(
                    () => {
                        reject();
                    }
                );

        }
    );
}

function precacheUrl(url) {
    if (!isBlacklisted(url)) {
        caches.open(CACHE_VERSIONS.content)
            .then((cache) => {
                cache.match(url)
                    .then((response) => {
                        if (!response) {
                            return fetch(url)
                        } else {
                            // already in cache, nothing to do.
                            return null
                        }
                    })
                    .then((response) => {
                        if (response) {
                            return cache.put(url, response.clone());
                        } else {
                            return null;
                        }
                    });
            })
    }
}



self.addEventListener(
    'install', event => {
        event.waitUntil(
            Promise.all([
                installServiceWorker(),
                self.skipWaiting(),
            ])
        );
    }
);

// The activate handler takes care of cleaning up old caches.
self.addEventListener(
    'activate', event => {
        event.waitUntil(
            Promise.all(
                [
                    cleanupLegacyCache(),
                    self.clients.claim(),
                    self.skipWaiting(),
                ]
            )
                .catch(
                    (err) => {
                        event.skipWaiting();
                    }
                )
        );
    }
);

self.addEventListener('fetch', event => {
    event.respondWith(handleFetch(event.request));
  });
  
async function handleFetch(request) {
    const cache = await caches.open(CACHE_VERSIONS.content);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const response = await fetch(request);

        if (response.status < 400) {
            if (~SUPPORTED_METHODS.indexOf(request.method) && !isBlacklisted(request.url)) {
                cache.put(request, response.clone());
            }
            return response;
        } else {
            if (response.status === 500) {
                return response; // Return the 500 error response
            } else if (response.status === 404) {
                return response; // Return the 404 error response
			} else if (response.status === 402) {
				return response; // Return the 402 error response
			}
        }
    } catch (error) {
        console.error('Error in fetch handler:', error);

        if (!navigator.onLine) {
            console.log("CATCH: return offline Cache");
            const offlineCache = await caches.open(CACHE_VERSIONS.offline);
            const offlineResponse = await offlineCache.match(OFFLINE_PAGE);
            return offlineResponse;
        }

        throw error;
    }
}

self.addEventListener('message', (event) => {

    if (
        typeof event.data === 'object' &&
        typeof event.data.action === 'string'
    ) {
        switch (event.data.action) {
            case 'cache':
                precacheUrl(event.data.url);
                break;
            default:
                console.log('Unknown action: ' + event.data.action);
                break;
        }
    }

});