/* eslint-disable no-undef */

/**
 * @typedef {object} FetchEvent
 * @property {Request} request - The Request the browser intends to make
 * @property {function(Response| PromiseLike<Response>): void} respondWith - Prevent default fetch
 * handling and provide custom response
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetchevent
 */

/**
 * @typedef {object} WorkerLocation
 * @property {string} host - Host part of the worker's location
 * @property {function(): string} toString - Serialized URL for the worker's location
 * @property {string} origin - Worker's origin
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WorkerLocation
 */

/**
 * @typedef {object} ServiceWorkerGlobalScope
 * @property {function(...(string | URL)): void} importScripts - Imports scripts into worker's scope
 * @property {WorkerLocation} location -  WorkerLocation associated with the worker
 * @property {function(string, Function): void} addEventListener -  Registers an event handler
 * @property {function(): Promise<void>} skipWaiting - Force waiting service worker to become active
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope
 */

/**
 * @typedef {object & ServiceWorkerGlobalScope} GujWorkerGlobalScope
 */

/** @type {GujWorkerGlobalScope} */
const workerGlobalScope = self;

const env = /dev|local/.test(workerGlobalScope.location.host) ? "dev" : "prod";

// Homepage which is defined in config.[tenantShortName].js. Only set for subtenants.
// Gets replaced by "ServiceWorkerGeneratorPlugin" in the build chain.
const homepage = "";

// CleverPush channelId which is defined in config.[tenantShortName].js.
// Gets replaced by "ServiceWorkerGeneratorPlugin" in the build chain.
const webPushConfig = {
  dev: "TwdPbka4qvzhbdgCi",
  prod: "sZzr96ji3jfaR822u",
};

// import cleverpush-worker.js
if (webPushConfig[env] && typeof workerGlobalScope.importScripts === "function") {
  const channelId = webPushConfig[env];
  workerGlobalScope.importScripts(
    `https://static.cleverpush.com/channel/worker/${channelId}.js${workerGlobalScope.location.search}`
  );
}

// Name of the static cache. Every release has its own specific cache name.
// Gets replaced by "ServiceWorkerGeneratorPlugin" in the build chain.
const CACHE_NAME = "fad72ff8c3060f98d714084a669d33b4";

// List of files to cache on service worker install step. This is filled with
// paths by the "ServiceWorkerGeneratorPlugin" in the build chain.
const staticFiles = [
    'TT-Chocolates-Bold.fc61128599302e8b8fdc409b0b555343.woff2',
    'TT-Chocolates-Regular.37110986bb775fc6cfb0b3fa32736928.woff2',
    'ad-container.76f85bd3385e178f939e0de89408681b.css',
    'ad-element--large.5200de0e4f96613a52b5391c26e51812.css',
    'ad-element--print.aa2db3bc32b7cb08b5b3ba1c54c20f07.css',
    'ad-element-apester.9366c7f0db2f5c8ec7a50d5bd54f940a.css',
    'ad-element.87887befbfd743ef4492ce9fb93653fb.css',
    'ad-element.amp.mock.af2e08a876765dd21e571ab13f734684.css',
    'ad-sponsors--large.bf3c83f506b1594d8b4e05d061a27d4b.css',
    'ad-sponsors.0a57ccb6c0df5a3f673f0f8d0039a978.css',
    'ad-tag-container.60b905a9b07e0cdaedf8c78915d3e422.css',
    'advertising-head.930f0bdadcde5f1db0aa6bf87527edd8.js',
    'advertising.41c68d32ec48727e4b65ad6bfe646d2e.js',
    'article-navigation.47ded65683602934d96e3b4bac85124a.js',
    'article-navigation.gal--large.13acc8fe3916d1cdb59941bdf840c85c.css',
    'article-navigation.gal.3c603f1fe1ea4cd8f3ffaf53ea66e4f6.css',
    'article.gal--large.13871516d0e39cbbc494b81bc023f1c1.css',
    'article.gal.cd527722662aa3eb615978284724cf5f.css',
    'audio--large.e4e9ecf879ac5f5c1a491a98b5c26c20.css',
    'audio.gal.77240cee4531139bcc95a6dca1144c62.css',
    'author-element.gal--large.13b6af9313645ae0d5d48818418956cc.css',
    'author-element.gal.7d322074269a3301708a9ba963add25a.css',
    'authors.gal.79aacc145f1b26d3bd870a55de4f7b78.css',
    'autonative.b2605affa2bcc45c6356efc03670a465.js',
    'breadcrumb--large.38cde0b039f57e19a95bb0ba14bc990f.css',
    'breadcrumb.56c2c0d60cda2b9abefb4137539d71de.css',
    'brightcove-amp-player/brightcove-amp-player.css',
    'button--print.8ea873392c827ed03ce924e58ccdee2e.css',
    'button.gal--large.81cf4393e6d026d2bbb47ea75973fb3a.css',
    'button.gal.c31ce4184607f3bbf2541c25477fa398.css',
    'clear-element.d6abf526df7ed536ca9a036a83d3ad76.css',
    'credits-author-source.78a81ff9da430221780de5d55ebbc2fb.css',
    'deep-link-title.gal--large.500d2ec85dd2576a4447e6e1fb0da112.css',
    'deep-link-title.gal.3b9c1d8ee65cf1357aa153af752577af.css',
    'disqus--large.a972dcfde6cb1ec81700658a0ab48641.css',
    'disqus.005086d102eb63e0877d093d29734ea6.js',
    'disqus.d7c46e0ed72d9e123ceefd4ae944ef41.css',
    'drawer.e6573f69d42d66df6737b7fdc1fbb9d8.js',
    'drawer.gal--large.05e4925b501a5b50da82f1880c622a40.css',
    'drawer.gal.dca354dc08c67e37968dda8860a5ac25.css',
    'embed.0b7ecce17c7bf8169641efb2fdcd4658.js',
    'embed.1f2201c9b0138dd24d0d63f0b54f986e.css',
    'external-html-element--large.69faa5983cc5f00abfc048022360465c.css',
    'external-html-element.79fb74dc70074549c6ba09958709c2b5.css',
    'footer.e1853f197e355bec257324b32c7e3f12.js',
    'footer.gal--large.a7615ef1adbcc7084e417aacbb744152.css',
    'footer.gal.6643488ecfcf73f9a2240412e928df74.css',
    'gallery.gal--large.d32fe8d63bc391ef2eff21088be9b896.css',
    'gallery.gal.6f4b12471b5ae3eaf72132d8b4e24f37.css',
    'group--print.9b348d0e090fa91effffd047f01a43f8.css',
    'group-gallery.353e1334f338ba7d6d622b151b9ebf48.js',
    'group-gallery.gal--large.0bf0eb1c2e7fa845120ee58587580493.css',
    'group-gallery.gal.47c473f54eb1dd03caece673940083d8.css',
    'group-gallery__teaser-recipe--large.97910edd19f64acbb872aff5447b0c28.css',
    'group-gallery__teaser-recipe.c46d8cde3bb67b0cf32a4be283220f7a.css',
    'group-inline-gallery.7ae1314be451229bafaeb103ea249bd7.js',
    'group-inline-gallery.gal--large.8dca394c54d595f6db054b4af5fe32d4.css',
    'group-inline-gallery.gal.186a3489ed7eab3ab4c877b833aa5dd7.css',
    'group-teaser-gallery.24b098e5eb8ecf3ba936e8e6a7c8cc45.js',
    'group-teaser-gallery.gal--large.7d0ccaf06155d7d63bd201ab54075568.css',
    'group-teaser-gallery.gal.cdea8e3a7b97172ecbc03629ce2779b4.css',
    'group-teaserblock.gal--large.72fa5031cb32b8a62af7ad152dc0d6da.css',
    'group-teaserblock.gal.f61940cc7a8d39fa539a6ee5fcb342e1.css',
    'group-teaserlist--large.bd377636c366f0c0b86020f5be158661.css',
    'group-teaserlist.gal.e217f83de0b6257a65434413896b9d9c.css',
    'group.gal--large.5c4942859bcf4342c4181a6c190026ab.css',
    'group.gal.94d641f693299030bcc720fe28d4bd7c.css',
    'guj-service.325f343ded0dfa7c43f741f94d470482.js',
    'header.gal--large.a4493729c47beb97ed7810c4d516312d.css',
    'homad.d85f628757484794a7f6f042bf28bc1f.js',
    'iframe-element.0b37460beb5c677ddc893f9613e53c2d.css',
    'image-element.gal--large.a84546cb420055103cea411186d858e0.css',
    'image-element.gal.acf73505417c3353686546d5a71ca863.css',
    'image.5162ec32360524cde7643337707015d3.css',
    'index--large.646be8fe438d7ca318d9205f2d0fcb44.css',
    'index-recipe-topic--large.2827e1598c9d9b1d59574f107b012bb1.css',
    'index-recipe-topic.67c97509b1b164ad65f7540842b4163f.css',
    'index.5dbdbaca2ba0cfdeeef3ad2eaf679015.css',
    'intro.80a5634188bcb9b08f9a8af5e339a3db.css',
    'ivw-measurement.48c9901e58b78f75b9e22b7984c4f0d1.js',
    'links--large.cbc110d22d1d3f35da8fd496aecc689d.css',
    'links.gal.a9c7e48b738c8aa21e47b04cd9007fae.css',
    'list-element.gal.e9e5d387d6b1152f4a6572d99767cc81.css',
    'menu.b7a37f687d85e907d623e2dcf4091b68.js',
    'menu.gal--large.62803e8e09abdd447c184e5d2f1bb675.css',
    'menu.gal.829de770f9c5466e7b62d63a546ac562.css',
    'message-handler.d7551d36fb4bd4d44c133443dc0198ba.js',
    'mockexplorer-utils.11c4f12d86353f1d64518a76a7b3b2f7.js',
    'mockexplorer.5ee8afa428273e57e6bdcd48c2c9b1ce.css',
    'notifications.1309a6f1fcf979cef53f75308e1914f9.css',
    'notifications.3e33eb6c44356acdfc2a3b2ac8a41522.js',
    'outbrain.9e863a0e96863cad5e4598b7aeb243f7.css',
    'outbrain.dc1ee9e510a7772dfebb8e2459895d7f.js',
    'page-critical.594c87d74fba774b607a02ab0579ae40.css',
    'page-head.f92fc8273d747e7412c8deb97000dfd0.js',
    'page-print--large.82deedf6b6e2f9dfd7248bb2c65d6a41.css',
    'page-print.e87cadba5e6c7a5fe879194631b6bbb3.css',
    'page.f4f408404973d58ddaafbac8db653f09.js',
    'page.gal--large.beb488145b32f68ae11932940e18e797.css',
    'page.gal-amp.ca69d87c84a361541a24819ce4b597a7.css',
    'page.gal-critical.86feb5e5c192a6c066e54fbc8383e0f1.css',
    'page.gal.285180067c9ec6e54ce409131da60372.css',
    'pagination--large.61322151a8e6e89191eb435a08e3672e.css',
    'pagination.gal.b5de32d0ba2818f6eeb9a9b0b44e3f23.css',
    'paid-barrier.d6b98c94612b7ab9e0f556f47dfa6611.css',
    'paywall-overlay.a56f28dcd1d707e28c17ec532a928a0b.js',
    'person-element--large.7154eea03d16044c323c917ffabc2b38.css',
    'person-element.a172674715e91a680573ee8d62176ad7.css',
    'picture--large.959e57842c9d85375fcf2c3394821ef7.css',
    'picture.062324e9ab941a17945660f82b3bc357.css',
    'plant-meta--large.b37233dc152f2fa9bc451e2774f95043.css',
    'plant-meta.36526852dd7b1e8220941417ef4ec1c5.css',
    'presentership-affiliate.ab80d88ed32a3bedb4638e3b27635e2a.js',
    'presentership-affiliate.gal--large.0c63a0427dba01be15fb9ac1687449d9.css',
    'presentership-affiliate.gal.4b53cb5b8dd29e517b39324a4380a0ff.css',
    'print-controls.32c2754bfed9c62db242c010731f7db5.js',
    'rating.f7d138b73a07c8a2ffb9a3880a2ca405.css',
    'recipe--large.25a93e79f6e2edcd758e58aec4eadaf6.css',
    'recipe-ingredients--print.73ed7b847d3636393ccbbb87eb42dc30.css',
    'recipe-ingredients.0398d3c866ce222d47a14778277ffdfd.css',
    'recipe-ingredients.d2d0064fbe6b0c82c352aaa7fc4fcff2.js',
    'recipe-meta--large.1579d70d14552bcbc7c78e801db77f09.css',
    'recipe-meta--print.725289ca8d4913f6041769fd0f107ae7.css',
    'recipe-meta-author--large.65d703b04e8d7021e5e919400d2bbe4a.css',
    'recipe-meta-author.6239a6ba8d19b152de4ec9f4dae038c7.css',
    'recipe-meta.dfdf5594170460a49716644aafa58a73.css',
    'recipe-print.cef1367d2352b454386c6370a9523f7b.css',
    'recipe-rating.324801868d4c11a9753a531f1b1e3b24.css',
    'recipe-rating.852736280d064a430e68b1f79d04a03b.js',
    'recipe-toolbar--large.87ffee22c056a6e3b83d6bc2690e4824.css',
    'recipe-toolbar.1d5cd570c32490e9e5e99a1af80f3a7a.css',
    'recipe.4121ed996838ac67649580b37b14293f.css',
    'rewe-button--large.07053256b5d1675ff641251e8831e234.css',
    'rewe-button.1dc4b841b47b3c2b789f60c9cabc85a0.js',
    'rewe-button.57ba4f781decbfa3d046398e6211844e.css',
    'serviceWorkerLoader.913998431c53cd5fe00790d27c3f5a32.js',
    'sidebar.2c9048ae0b56f0e2d2c03e7bf2fd1102.css',
    'sidebar.3aeb6acb1fa23641c4faa44b70b2093b.js',
    'sidebar.gal--large.693cae9a596182e30c54200f76cbfe7a.css',
    'slide-navigation.gal--large.cf8d12bd8368f7bdaf77215e996ecacd.css',
    'special-relateds.db24e6263c6fb8f537656fb436685e6b.css',
    'star-portrait--large.8bd1c17d26147d295cd55989c1861ee6.css',
    'star-portrait.gal.84af02c2d46d68204dbe0ebd7b3d7710.css',
    'teaser-info-box--large.0a730ebf39401f8b3cd5f2d59bd69029.css',
    'teaser-info-box.gal.5ef988a7e132fa6ed5517bfed18b91ff.css',
    'teaser-multi-picture--large.9d9714a5f2638406b4985d7258b8579a.css',
    'teaser-multi-picture.gal.ae3dd357bc3a92b249cee75cd73eeb1f.css',
    'teaser-recipe--large.198f81834ef4079551f4fb22809f93c7.css',
    'teaser-recipe.de8a73970457dd080e09ba0370a6a490.css',
    'teaser.gal--large.fe864c3b217d502124df6fe218ac640d.css',
    'teaser.gal.93e1ea2b325b410bdcdd10e0e444fed8.css',
    'teaser__brand-identifier.11774b48e7cc8cbef75be74176ea20d6.css',
    'text-element--print.f3e3c7d58a5147184144724d441b26e1.css',
    'text-element.gal.307b339bc3314175cbc36b3b66844176.css',
    'title--large.b208cad428da4796f09efb4ea0bc281d.css',
    'title--print.aa533afa6de92e3b2d697cc05b2f8bab.css',
    'title.gal.54cd2faa5a19fde6fe3b4bc0818ced99.css',
    'tracking-ga-head.7bb12496d308fdd96a0113ee0165ccf6.js',
    'tracking-ga.8942b52d4a5f50a007a7077f195f46d0.js',
    'tracking-nielsen.2e7a8f4ad61996d112d038b3484dd301.js',
    'tracking-upscore.a488ebb874170cf822b28f1728554452.js',
    'unknown-partial.ec299acc40d9f3cc75b2fcaa3875e364.css',
    'video--print.2f0b250f5d907dc6d13b2e5a2c6b3575.css',
    'video-brightcove-loader.38ae46e3b3a1f7ecabf83ae37a713db5.js',
    'video.gal--large.c7a548fa20f36c9611a3bca8c3d01e0a.css',
    'video.gal.9d1667e801bd9acd309fb1aae44284b8.css',
    'wakelock.d2379c424bf1ffc8e808ec919d13bc6d.js',
    'widget-element-expert-element--large.475d0725b04e106558f160c340d251ec.css',
    'widget-element-expert-element.da3b7d71d0707756b88844bb0df23d44.css',
    'widget-element-x-bookmarklist.1176e9a645634aeb3041225e134b9eb9.js',
    'widget-element-x-real-estate-map.343b3a17a387a37102442cebd6b7f5c1.css',
    'widget-element-x-real-estate-map.4a0f909aedf208c56a7131472bb45309.js',
    'widget-element-x-twitter.5ac7d2bb6e55b59677309711bb4c5122.css',
    'widget-element-x-twitter.777a112f1242d3b34bb43ed70af8184c.js',
    'widget-element.8d4c980d696144d999feeb6090921746.css',
    'x-ajax.43717755dbe2425001b5b62d4283fc3a.js',
    'x-beautify-number.2372cb910f97a0d3c990a0608bf91a39.js',
    'x-bookmarkbutton--large.1e02c382bf1cd715da57bff995fa2b95.css',
    'x-bookmarkbutton.218c82312ea1c38db1c58d26c02045ad.js',
    'x-bookmarkbutton.b2d61cc403914da9d82459abe81f227b.css',
    'x-clamp.eba6e2d0bfd4e2a241eec448ac7f0be1.js',
    'x-clone.c5d4d12ec616e487e892b5c5f2edea81.js',
    'x-gallery-scroller.48826cad7696d2643b33774fcf9b6437.js',
    'x-modal--large.9f154296d5db82078663ff28db4a5f37.css',
    'x-modal.2e1cd3b1bd2d5cffdfb3ccfbbc214e1b.js',
    'x-modal.4d45c1081324ca24fa267e68e534dae3.css',
    'x-observe.e0f62422d706839ecc6843086bd623c2.js',
    'x-portions-buttons.94ec29a1bf1326433dfdcbe252d67649.js',
    'x-portions.c669a19a11e9a713cdd69b2e7c9501cb.js',
    'x-position.bb5d18c48853d5b7f932155a2d8b292d.js',
    'x-rating.704d81c6fa4d2c65457751725371f2e1.js',
    'x-token.ac2099d2c0d7b6b5537447367ee5a7e6.js',
];

/**
 * Fetch request from cache
 *
 * @param {Request|string} request - Instance of Request
 * @returns {Promise<Response>} Instance of Response
 */
function fetchFromCache(request) {
  return caches.match(request).then((response) => {
    if (!response) {
      const url = typeof request === "string" ? request : request.url;
      throw Error(`${url} not found in cache`);
    }
    return response;
  });
}

/**
 * Returns URL to offline document.
 *
 * @returns {URL} Offline URL
 */
function getOfflineURL() {
  // Prepend/Append "/" to homepage if necessary.
  return new URL(
    "offline",
    workerGlobalScope.location.origin + (homepage ? `/${homepage}/`.replace(/\/\//g, "/") : "")
  );
}

/**
 * Step 1: Installation
 * This is the first step of the service worker lifecycle. The service worker gets into
 * this when no service worker was installed before, or when a new service worker is available.
 * It adds all static files into a build specific cache.
 */
workerGlobalScope.addEventListener("install", (event) => {
  const cacheKey = `${CACHE_NAME}--static`;

  event.waitUntil(
    caches
      .open(cacheKey)
      .then((cache) => {
        // Add all asset URLs
        const filesToCache = staticFiles.map(
          (filename) => `${workerGlobalScope.location.origin}/__assets/${filename}`
        );

        // Cache offline document "/offline" or "/SUBTENANT/offline".
        filesToCache.push(getOfflineURL().toString());

        // Add files to cache
        cache.addAll(filesToCache);
      })
      .then(() => workerGlobalScope.skipWaiting())
  );
});

/**
 * Step 2: Activation
 * This is the second step of the service worker lifecycle. The service worker gets into
 * this after the installation step.
 * It deletes all old caches.
 */
workerGlobalScope.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => !cacheName.startsWith(CACHE_NAME))
            .map((cacheName) => caches.delete(cacheName))
        )
      )
  );
});

/**
 * Step 3: Fetch
 * This is the last step of the service worker lifecycle. The service worker works as a
 * proxy and serve all cached resources from the static cache. If there is no
 * resource on the cache it is fetched like normal.
 */
workerGlobalScope.addEventListener("fetch", (event) => {
  /**
   * Determine if request should be handled by the service worker or not.
   *
   * @param {Request} request - Instance of Request
   * @returns {boolean} Should handle fetch?
   */
  function shouldHandleFetch(request) {
    const url = new URL(request.url);
    return request.method === "GET" && url.origin === location.origin;
  }

  /**
   * Handle the fetch event.
   *
   * @param {FetchEvent} event - Instance of Event
   */
  function onFetch(event) {
    const request = event.request;
    const url = new URL(event.request.url);

    if ((!homepage && url.pathname === "/") || (homepage && url.pathname === homepage)) {
      const offlinePath = getOfflineURL().pathname;
      // The root page is cached via precache but under a different
      // pathname.
      // @see https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
      event.respondWith(fetch(request).catch(() => fetchFromCache(offlinePath)));
    } else if (/\.[a-f0-9]{20,}\.(css|js|woff2)$/.test(url.pathname)) {
      // Static files are cached via precache.
      // @see https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
      event.respondWith(fetchFromCache(request).catch(() => fetch(request)));
    }
  }

  if (shouldHandleFetch(event.request)) {
    onFetch(event);
  }
});
