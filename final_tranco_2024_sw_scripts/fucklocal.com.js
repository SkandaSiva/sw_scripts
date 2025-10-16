importScripts('https://cdn.ampproject.org/sw/amp-sw.js');
AMP_SW.init(
    {
        assetCachingOptions: [{
            regexp: /\.(png|jpg|jpeg|svg)/,
            cachingStrategy: 'CACHE_FIRST'
        }],
        offlinePageOptions: {
            url: '/offline',
            assets: []
        }
    }
);