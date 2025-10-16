importScripts('/sw-toolbox.js');

toolbox.precache([
    '.',
    '/sites/all/themes/tssks/img/website-logo.png',
    '/sites/all/themes/tssks/img/website-mobile-logo.png'
]);


toolbox.router.get(/\/[^.]*$|^(?:https?:)?\/\/[^\/]+$/, toolbox.networkFirst, {
    cache: {
        name: 'page',
    },
});


toolbox.router.get(/\.(woff)|(woff2)|(eot)|(svg)|(ttf)/, toolbox.cacheFirst, {
    cache: {
        name: 'fonts',
        maxAgeSeconds : 60 * 60 * 24 // 1 Jour
    }
});


toolbox.router.get(/\.(css)|(js)|(json)|(xml)$/, toolbox.cacheFirst, {
    cache: {
        name: 'source',
    }
});

toolbox.router.get('/sites/default/files/styles/*', toolbox.cacheFirst, {
    cache: {
      name: 'images',
      maxEntries: 200,
      maxAgeSeconds : 2629800 // 1 mois
    }
});
