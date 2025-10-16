importScripts("https://cdn.ampproject.org/sw/amp-sw.js");
AMP_SW.init({
    assetCachingOptions: [
        {
            regexp: /\.(png|jpg|jpeg|webp|json|css|js)/,
            cachingStrategy: "NETWORK_FIRST",
            // cachingStrategy: "STALE_WHILE_REVALIDATE",
        },
    ],
    offlinePageOptions: {
        url: "/offline.html",
        assets: [],
    },
});
