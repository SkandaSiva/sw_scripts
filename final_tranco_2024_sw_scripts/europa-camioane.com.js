var CACHE_NAME = 'static-cache-v12.3';
var DATA_CACHE_NAME = 'static-cache-v12.3';
var PRECACHE_FILES = [
    '/', '/offline.html', '/themes/img/home/offline.png', '/themes/img/group-1/logos/logo-svg.new.svg', '/themes/img/group-1/loaders/loader.svg', '/themes/img/sprites/families.svg', '/themes/plugins/bootstrap/css/bootstrap.min.css', '/themes/plugins/fancybox/css/fancybox.css', '/themes/css/sites/theme1.css?v=20241018', '/themes/plugins/font-awesome5/webfonts/fa-solid-900.woff2', '/themes/plugins/font-awesome5/webfonts/fa-regular-400.woff2', '/themes/plugins/font-awesome5/webfonts/fa-brands-400.woff2', '/themes/img/sprites/category-1.svg'
];
let urlCurrent = '';
let nbRequest = 0;

self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_FILES);
        })
    );
    //Forces the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('deleteg');
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    // Claim any clients immediately, activate service worker immediately without reloading
    self.clients.claim();
});

/**
 * Function execute once by page after the delay, checks the precache and regenerates missing files
 * @param delay
 * @returns {Promise<unknown | void>}
 */
const verifPrecache = async function (delay) {
    return new Promise((resolve, reject) => {
        if (nbRequest === 0) {
            //To execute the precache only a once after a delay
            nbRequest++;
            setTimeout(resolve, delay);
        } else {
            reject('Precache alreadyVerified');
        }
    }).then(() => {
            caches.open(CACHE_NAME).then(cache => {
                return Promise.all(
                    PRECACHE_FILES.map(async (uri) => {
                        cache.match(uri).then(response => {
                            if (response == undefined) {
                                var requestPrecache = new Request(uri, {
                                    method: "GET",
                                    mode: "same-origin",
                                    cache: "no-cache",

                                });
                                fetch(requestPrecache)
                                    .then((response) => {
                                        if (response.ok) {
                                            //console.log("push precache " + uri);
                                            pushCache(requestPrecache, response.clone());
                                        }
                                    })
                            }
                        });
                    })
                ).then(() => {
                    //Reinitialise verif precache(because service worker keep the state even on reload)
                    nbRequest = 0;
                    //console.log('end precache');
                })
            })
        }
    ).catch(e => null)
}

/**
 * reconstruct the url without fragment
 * @param url
 * @returns {*}
 */
const cleanUrl = (url) => {
    let urlO = null;
    let urlClean = '';
    try {
        urlO = new URL(url);
        urlClean = urlO.origin + urlO.pathname + urlO.search
    } catch (error) {
        urlClean = event.request.url;
    }
    return urlClean;
}

self.addEventListener('fetch', event => {
    //Filter url GET for current domain
    if (!isUrlToRegister(event.request) || event.request.method != 'GET') {
        return ;
    }

    //Chrome adds a # in current url
    urlClean = cleanUrl(event.request.url);
   // console.log("url clean:" + urlClean);
    if (event.request.mode == 'navigate') {
        //only for firefox
        urlCurrent = event.request.url;
        //console.log('url current:' + urlCurrent);
    }
    verifPrecache(10000);

    //Application strategy network first
    if ((event.request.mode == 'navigate' && urlCurrent == event.request.url)
        || (event.request.mode == 'no-cors' && urlCurrent != event.request.url)
    ) {
        //let v = Math.floor(Math.random() * 10);
        //console.log("v" + v + "mode:"  + event.request.mode + " request:" + event.request.url); //test prod
        event.respondWith(
            netWorkFirst({
                request : event.request,
                fallBackUrl : '/offline.html',
                urlClean: urlClean
            })
        );
    }
});

/**
 * Apply the network policy first
 * @param request
 * @param fallBackUrl
 * @param urlClean
 * @returns {Promise<Response>}
 */
const netWorkFirst = async ({request, fallBackUrl, urlClean}) =>
    caches.open(DATA_CACHE_NAME).then((cache) =>
        fetch(request)
            .then((response) => {
                //console.log("status:" + response.status + " ok:" + response.ok + " url:" + request.url + "type:" + response.type);
                //redirect return response
                // opaqueredirect: The fetch request was made with redirect: "manual".
                // The Response's status is 0, headers are empty, body is null and trailer is empty.
                if (response.type === 'opaqueredirect') {
                    return response;
                }

                //Save the url in api cache if the status is between 200 AND 299
                if (response.ok) {
                    pushCache(urlClean, response.clone());
                } /*else {
                    throw ('Error response ' + request.url);
                }*/
                return response;
            })
            .catch((err) => {
                //If network fails, search the cache api or send a request
                return cache.match(request)
                    .then((response) => {
                        //console.log("cache match:" + err + " ok:" + response.ok);
                        return response || fetch(request.clone());
                    }).catch((err) => {
                        //Send offline html page for HTML response
                        if (request.headers.get('Accept').indexOf('text/html') != -1) {
                            //console.log("send offline page for : " + request.url);
                            return cache.match(fallBackUrl);
                        }
                        //console.log("send 408 error:" + err + " url:" + request.url);
                        //Send response 408
                        return new Response("Network error happened", {
                            status: 408,
                            headers: { "Content-Type": "text/plain" },
                        });
                    });
            })
    )
;

/**
 * Filter url
 * @param request
 * @returns {boolean}
 */
const isUrlToRegister = function (request) {
    if (
        (request.url.includes('.via-mobilis') || request.url.includes('www.europa-camioane.com'))
        && request.url.includes('securepubads') == false
        && request.url.includes('google') == false
        && request.url.includes('criteo') == false
        && request.url.includes('facebook') == false
        && request.url.includes('bing') == false
        && request.url.includes('rsavm.json') == false
        && request.url.includes('my.via-mobilis.com') == false
        && request.url.includes('account.via-mobilis') == false
        && request.url.includes('jobs/apply-for') == false
        && request.url.includes('worker.js') == false
        && request.url.includes('buyers.js') == false
    ) {
        return true;
    }
    return false;
}

/**
 * Save in the API CACHE
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
const pushCache = async (request, response) => {
    //console.log("pushCache " + request);
    caches
        .open(DATA_CACHE_NAME)
        .then(cache => cache.put(request, response));
};
