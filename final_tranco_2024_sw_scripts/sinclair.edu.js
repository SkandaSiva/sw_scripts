var config = {
    version: 'xi',
    staticCacheItems: [
        '/',
        '/www/css/mura.6.1.1.min.css',
        '/www/css/mura.6.1.1.skin.css',
        '/www/includes/themes/wwwBootstrap4/assets/bootstrap4/css/bootstrap.min.css',
        '/www/includes/themes/wwwBootstrap4/css/site.css',
        '/www/includes/themes/wwwBootstrap4/css/site_2016SU.css',
        '/www/includes/themes/wwwBootstrap4/css/site_bootstrap4.css',
        '/www/includes/themes/wwwBootstrap4/css/explore.css',
        '/www/includes/themes/wwwBootstrap4/css/RYPP.css',
        '/www/includes/themes/wwwBootstrap4/css/theCenter.css',
        '/www/includes/themes/wwwBootstrap4/css/bootstrap-select.min.css',
        '/www/includes/themes/wwwBootstrap4/css/buzina-pagination.min.css',
        '/www/includes/themes/wwwBootstrap4/css/font.css',
        '/www/includes/themes/wwwBootstrap4/css/all.min.css',
        '/www/includes/themes/wwwBootstrap4/webfonts/fa-light-300.woff2',
        '/www/includes/themes/wwwBootstrap4/webfonts/fa-regular-400.woff2',
        '/www/includes/themes/wwwBootstrap4/webfonts/fa-solid-900.woff2',
        '/www/jquery/jquery-3.5.1.min.js',
        '/www/jquery/popper.min.js',
        '/www/includes/themes/wwwBootstrap4/assets/bootstrap4/js/bootstrap.min.js',
        '/www/includes/themes/wwwBootstrap4/js/bootstrap-select.min.js',
        '/www/includes/themes/wwwBootstrap4/js/buzina-pagination.min.js',
        '/www/includes/themes/wwwBootstrap4/js/eventhover.js',
        '/www/includes/themes/wwwBootstrap4/js/jquery.anchor.js',
        '/www/includes/themes/wwwBootstrap4/js/jquery.easing.1.3.js',
        '/www/includes/themes/wwwBootstrap4/js/jquery.hoverIntent.minified.js',
        '/www/includes/themes/wwwBootstrap4/js/jquery.youtubeEmbed.js',
        '/www/includes/themes/wwwBootstrap4/js/moment.min.js',
        '/www/includes/themes/wwwBootstrap4/js/stickyfill.min.js',
        '/www/js/Chart.bundle.min.js',
        '/www/js/fetch.js',
        '/www/js/RYPP.js',
        '/www/js/theCenter.js',
        '/www/includes/themes/wwwBootstrap4/js/site.js',
        '/www/includes/themes/wwwBootstrap4/js/svgxuse.js',
        '/www/includes/themes/wwwBootstrap4/images/sinclair-logo.png',
        '/www/images/icons/icon-144x144.png',
        '/www/maintenance.html',
        '/www/404.html'
    ],
    cachePathPattern: /^\/(?:(css|images|js)\/(.+)?)?$/,
    offlineImage: '<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' +
        '<title id="offline-title">Offline</title>' +
            '<g fill="none" fill-rule="evenodd">' +
                '<path fill="#D8D8D8" d="M0 0h400v300H0z"/>' +
                '<text fill="#9B9B9B" font-family="Times New Roman,Times,serif" font-size="72" font-weight="bold">' +
                    '<tspan x="93" y="172">offline</tspan>' +
                '</text>' +
            '</g>' +
        '</svg>',
    offlinePage: '/www/404.html'
};

function cacheName (key, opts) {
    return `${opts.version}-${key}`;
}

function addToCache (cacheKey, request, response) {
    if (response.ok) {
        let copy = response.clone();
        caches.open(cacheKey)
        .then(cache => {
            cache.put(request, copy);
        });
    }
    return response;
}

function fetchFromCache (event) {
    return caches.match(event.request)
    .then(response => {
        if (!response) {
            throw Error(`${event.request.url} not found in cache`);
        }
        return response;
    });
}

function offlineResponse (resourceType, opts) {
    if (resourceType === 'image') {
        return new Response(opts.offlineImage, {headers:{'Content-Type':'image/svg+xml'}});
    } else if (resourceType === 'content') {
        return caches.match(opts.offlinePage);
    }
    return undefined;
}

self.addEventListener('install', event => {
    function onInstall (event, opts) {
        let cacheKey = cacheName('static', opts);
        return caches.open(cacheKey)
        .then(cache => cache.addAll(opts.staticCacheItems));
    }

    event.waitUntil(
        onInstall(event, config).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    function onActivate (event, opts) {
        return caches.keys()
        .then(cacheKeys => {
            let oldCacheKeys = cacheKeys.filter(key => key.indexOf(opts.version) !== 0);
            let deletePromises = oldCacheKeys.map(oldKey => caches.delete(oldKey));
            return Promise.all(deletePromises);
        });
    }

    event.waitUntil(
        onActivate(event, config)
        .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {

    function shouldHandleFetch (event, opts) {
        let request = event.request;
        let url = new URL(request.url);
        let criteria = {
            matchesPathPattern: opts.cachePathPattern.test(url.pathname),
            isGETRequest: request.method === 'GET',
            isFromMyOrigin: url.origin === self.location.origin
        };
        let failingCriteria = Object.keys(criteria).filter(criteriaKey => !criteria[criteriaKey]);

        return !failingCriteria.length;
    }

    function onFetch (event, opts) {
        let request = event.request;
        let acceptHeader = request.headers.get('Accept');
        let resourceType = 'static';
        let cacheKey;

        if (acceptHeader.indexOf('text/html') !== -1) {
            resourceType = 'content';
        } else if (acceptHeader.indexOf('image') !== -1) {
            resourceType = 'image';
        }

        cacheKey = cacheName(resourceType, opts);

        if (resourceType === 'content') {
            event.respondWith(
                fetch(request)
                .then(response => addToCache(cacheKey, request, response))
                .catch(() => fetchFromCache(event))
                .catch(() => offlineResponse(resourceType, opts))
            );
        } else {
            event.respondWith(
                fetchFromCache(event)
                .catch(() => fetch(request))
                    .then(response => addToCache(cacheKey, request, response))
                .catch(() => offlineResponse(resourceType, opts))
            );
        }
    }
    if (shouldHandleFetch(event, config)) {
        onFetch(event, config);
    }
});