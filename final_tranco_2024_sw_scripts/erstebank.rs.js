const ASSET_DOMAIN = 'https://cdn0.erstegroup.com';
importScripts(`${ASSET_DOMAIN ? `${ASSET_DOMAIN}/etc/designs/gem/themes/sw/` : ''}workbox-v4.3.1/workbox-sw.js`, `${ASSET_DOMAIN ? `${ASSET_DOMAIN}/etc/designs/gem/themes/sw/` : ''}precache-manifest.2fdad570.js`);
workbox.setConfig({modulePathPrefix: `${ASSET_DOMAIN}/etc/designs/gem/themes/sw/workbox-v4.3.1/`});
const fontsPath = '/content/dam/common/brand/fonts';
const fonts = [
    `${fontsPath}/inter/Inter-Latin.woff2`,
    `${fontsPath}/inter/Inter-LatinExt.woff2`
];

const gemPrecache = self.__gemPrecache.concat(fonts).map(path => `${ASSET_DOMAIN}${path}`);
workbox.precaching.precacheAndRoute(gemPrecache);
