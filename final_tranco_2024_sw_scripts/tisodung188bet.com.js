((global) => {
    importScripts('sw-toolbox.js');

    global.addEventListener('install', (event) =>
        event.waitUntil(global.skipWaiting())
    );

    global.addEventListener('activate', (event) =>
        event.waitUntil(global.clients.claim())
    );

    global.addEventListener('message', (event) => {
        setup(event);
        global.skipWaiting();
    });

    toolbox.router.get('/.*(mp4|ogg)$/', toolbox.networkOnly);

    function setup(event) {
        const domains = event.data;
        var cmsRequestRegExp = /http(s):\/\/.+service\/cmsApi\/GetContent.+/;

        toolbox.router.get(cmsRequestRegExp, toolbox.fastest, {
            cache: {
                name: 'cms',
                maxEntries: 100,
                maxAgeSeconds: 300,
            },
            origin: domains.star,
        });

        toolbox.router.get('/cdn(.*)', toolbox.cacheFirst, {
            cache: {
                name: 'contents',
                maxEntries: 100,
                maxAgeSeconds: 600,
            },
            origin: domains.cdn,
        });

        toolbox.router.get('/contents(.*)', toolbox.cacheFirst, {
            cache: {
                name: 'multi-cdn',
                maxEntries: 100,
                maxAgeSeconds: 600,
            },
            origin: domains.cdn,
        });
    }
})(self);
