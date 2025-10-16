importScripts("https://cdn.by.wonderpush.com/sdk/1.1/wonderpush-loader.min.js");
WonderPush = self.WonderPush || [];
WonderPush.push([
    "init",
    {
        webKey: "2ea3103a2acdebb1d2a6faadab9cba5930b0dbc289fed18735007aee5f5471f7",
    },
]);

importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js");

workbox.setConfig({ debug: false });

const { registerRoute, Route } = workbox.routing;
const { CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;

registerRoute(
    new RegExp("/fonts/.*\\.woff2"),
    new CacheFirst({
        cacheName: "fonts-cache",
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                maxEntries: 10,
            }),
        ],
    }),
);

registerRoute(
    ({ url }) => url.host === "fonts.wpcdn.pl",
    new CacheFirst({
        cacheName: "wpcdn-fonts-cache",
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                maxEntries: 10,
            }),
        ],
    }),
);
