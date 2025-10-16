'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"_next/static/chunks/439.6f36106021885f34.js": "e6b120e88d16c0f575d77ab62bf0879a",
"_next/static/chunks/286.c93d2fd0f3c0cce8.js": "0334fd9a4dae7aafee74c75229184df6",
"_next/static/chunks/app/page-156a8d914d408e3b.js": "657e8b26337e8412b626fbc3b950b4ba",
"_next/static/chunks/app/layout-2911ba7eaaef2408.js": "73760b820b70e9b007b2bf6cb017914d",
"_next/static/chunks/789.faaafa7fe34a1b82.js": "95fd64f4fa34a4a98f31fef7a5da09b0",
"_next/static/chunks/109-e0b0c9faa2123c32.js": "2b0168259b6270164ee6a10a9088b371",
"_next/static/chunks/800-013f016ef04a6ccc.js": "c7c235c07cb9b717b89c2d737039603b",
"_next/static/chunks/main-9e2acf84d40d9cfc.js": "654e9dbf19c28f6ff5e2955d93b66104",
"_next/static/chunks/669.b5b1ab1bd58d8438.js": "57caaf6261d2e045ae4b9b59caf2d14e",
"_next/static/chunks/752.f376734e1b2f51ce.js": "6cee3d5a95690b70907e6f628d2a0a8d",
"_next/static/chunks/816.e208f055d3f8938a.js": "26afa7a5835de291570f998ded233105",
"_next/static/chunks/819.3f51c7a3b4a31c97.js": "fbb8d3706b7bb0592adb14aeaca4b77c",
"_next/static/chunks/718.38182a4a8d55396d.js": "9490d504e1b2e455b6c3a7f8e315a482",
"_next/static/chunks/main-app-f98b8b6fef7d634e.js": "214e422136dd6d89eb5ca04a14beceda",
"_next/static/chunks/242.a0180828c2b9f295.js": "0bc24bdc21a65ebfb055215938b772b1",
"_next/static/chunks/webpack-b70e0a79c93d43d4.js": "dc71581f7c694b4c74dbc2743f6137b0",
"_next/static/chunks/883.19ad8321e523c240.js": "58d55a47e58d5bfb2b62eb780f3b20c7",
"_next/static/chunks/pages/_app-1f2755172264764d.js": "d91b25699dfa8e31443f9b084271d49d",
"_next/static/chunks/pages/_error-f5357f382422dd96.js": "fdf561ded8cb42626949b2ebf6dfa936",
"_next/static/chunks/framework-43665103d101a22d.js": "1b5a8d2ca24a8707e9dd40c7bdc12c06",
"_next/static/chunks/bce60fc1-9e08d3e68c5da0c1.js": "177672940b1d20756348eb280d5f589d",
"_next/static/chunks/polyfills-78c92fac7aa8fdd8.js": "79330112775102f91e1010318bae2bd3",
"_next/static/chunks/769-7f42f2da93e72275.js": "22ced6882127f9de064632d0de7f93b8",
"_next/static/8HvtPrw353gSKvMFkBXM9/_ssgManifest.js": "b404e23d62d95bafd03ad7747cc0e88b",
"_next/static/8HvtPrw353gSKvMFkBXM9/_buildManifest.js": "2b9a363deeb26f692fb90963ada43aab",
"version.json": "5a2fb3b765c467341621d3b08f98b267",
"game.js": "5c7992f6ba4f3da919a16f66051a2fcb",
"workbox-v3.6.3/workbox-streams.prod.js": "02a6ea213a32d95e931003eb280a2dbf",
"workbox-v3.6.3/workbox-core.dev.js": "fe14f58bdd553537c71a1c0c48b23b43",
"workbox-v3.6.3/workbox-core.prod.js.map": "64172581baa4e0c01e97c20ba2e5131c",
"workbox-v3.6.3/workbox-range-requests.dev.js.map": "d6bcc280766f30973b060bbad14548c9",
"workbox-v3.6.3/workbox-google-analytics.prod.js": "cd66b64748b4437ac643840a76db18f6",
"workbox-v3.6.3/workbox-cacheable-response.dev.js.map": "277be4db870521b3c670c83f330c4343",
"workbox-v3.6.3/workbox-background-sync.prod.js": "eeaa9c051d9e99a3c5c88b41228c8d74",
"workbox-v3.6.3/workbox-routing.dev.js.map": "ea104ad1ba607d87f5a580d37364ea07",
"workbox-v3.6.3/workbox-strategies.dev.js": "6579284dddfffea4982c49ab86c759ce",
"workbox-v3.6.3/workbox-cache-expiration.dev.js.map": "dde5e1f8802b38efd969ee87f90cb186",
"workbox-v3.6.3/workbox-sw.js.map": "09ada516dda940f79fe9c3384f329956",
"workbox-v3.6.3/workbox-broadcast-cache-update.dev.js": "7acc14de3f5d9f507623f224591ab5b1",
"workbox-v3.6.3/workbox-cache-expiration.prod.js.map": "c4b05aca88b8eccd349c8d769c5feaa9",
"workbox-v3.6.3/workbox-routing.dev.js": "81d794cb695830612f95b9124b79a293",
"workbox-v3.6.3/workbox-background-sync.prod.js.map": "89bf1755544c4ed279fa905e0be779cc",
"workbox-v3.6.3/workbox-core.prod.js": "52d19b122c5b0914811bade1f76a3faa",
"workbox-v3.6.3/workbox-range-requests.prod.js": "0b2f458c203b920658c7a2d651682355",
"workbox-v3.6.3/workbox-google-analytics.dev.js": "8235344cb0caddf7ddbf05e64a8f26b4",
"workbox-v3.6.3/workbox-precaching.prod.js": "f2f0c2810fea85a46c0cb28ff78a9159",
"workbox-v3.6.3/workbox-cacheable-response.prod.js.map": "3d74c9343544a47a43ca3db675d2e0ed",
"workbox-v3.6.3/workbox-cacheable-response.prod.js": "f1405e389d94a436707877491034e935",
"workbox-v3.6.3/workbox-broadcast-cache-update.prod.js.map": "4062336d93f6c66c94df77bcc4e44073",
"workbox-v3.6.3/workbox-precaching.prod.js.map": "2aa658ea469ea228853bccb5bddfa93c",
"workbox-v3.6.3/workbox-strategies.dev.js.map": "9384e5a6718f6c2306f2ece06e91e08e",
"workbox-v3.6.3/workbox-strategies.prod.js.map": "4d4a1888f2da5aea1a03ba36f84bc238",
"workbox-v3.6.3/workbox-precaching.dev.js.map": "43cda0de9b8c6ce629d175d7de067074",
"workbox-v3.6.3/workbox-broadcast-cache-update.dev.js.map": "bbae1aecd1a1dd935f46ee08bae97e47",
"workbox-v3.6.3/workbox-google-analytics.dev.js.map": "2e5c1bc8fde2c3b94103be94e6a902d6",
"workbox-v3.6.3/workbox-core.dev.js.map": "87d4b99dda1767311371a4a742928f91",
"workbox-v3.6.3/workbox-background-sync.dev.js.map": "6051bf56ac8d938cd6416ac261f32996",
"workbox-v3.6.3/workbox-navigation-preload.prod.js.map": "c01ff75a430318e60103f12115ecde1d",
"workbox-v3.6.3/workbox-cache-expiration.prod.js": "af8f9fdbc8cae90f380c9bac6f7f78df",
"workbox-v3.6.3/workbox-streams.dev.js.map": "057c6a316c49c522cc8b6d7fb4a62ecd",
"workbox-v3.6.3/workbox-google-analytics.prod.js.map": "0f073b3d0f6eb8583f193183b76cf3ef",
"workbox-v3.6.3/workbox-cache-expiration.dev.js": "7bd916bedfe4c6328761b0fc58f3507b",
"workbox-v3.6.3/workbox-sw.js": "cde784bf7f3ea826506b80c778226e75",
"workbox-v3.6.3/workbox-streams.prod.js.map": "0812a131c6d6fb7ed52448941f539b75",
"workbox-v3.6.3/workbox-routing.prod.js.map": "93982fc25541a081604f69c751955c98",
"workbox-v3.6.3/workbox-range-requests.dev.js": "8a8f4a1cd7d38748256282c4e7d57172",
"workbox-v3.6.3/workbox-broadcast-cache-update.prod.js": "a458ad9c8b901966b4d59ce3b4f5a869",
"workbox-v3.6.3/workbox-cacheable-response.dev.js": "195010b28149d1d8ceb4b7b7fd2084e1",
"workbox-v3.6.3/workbox-streams.dev.js": "02254027b2737cef8a4b98071c2eb2f0",
"workbox-v3.6.3/workbox-background-sync.dev.js": "9aea71255fb0f298098812aa11db65b2",
"workbox-v3.6.3/workbox-precaching.dev.js": "567166969a683137db14508f116c205a",
"workbox-v3.6.3/workbox-routing.prod.js": "3a26532a0a1c4b5245575cce26ba87dc",
"workbox-v3.6.3/workbox-navigation-preload.prod.js": "71b459464250cd4997deede4cc13f5cc",
"workbox-v3.6.3/workbox-navigation-preload.dev.js": "26cff10167061cbac9fb52b1cce5e16f",
"workbox-v3.6.3/workbox-strategies.prod.js": "ab888eaebd74c39206b73ace248c343e",
"workbox-v3.6.3/workbox-navigation-preload.dev.js.map": "18f5047ac5e61f0525af528d8ee19cf9",
"workbox-v3.6.3/workbox-range-requests.prod.js.map": "8a4be82dd180601ad6587d6ad059ccbd",
"index.html": "944b18cebb43a610130200ae37beafb2",
"/": "944b18cebb43a610130200ae37beafb2",
"akedo.js": "bcf8640e3f261833cf30f40da2a03fe2",
"main.dart.js": "244a0d0d92924019418d39ccd3c2f64e",
"index.txt": "3327d9df18c4fdd290269ab7c203b8ae",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"bundle.min.js": "3b01ee368683641d868937aa40c8b9b3",
"social.js": "8d83628756b2ca1410ceeee40dcbcfd2",
"precache-manifest.983b76ab44587fd0b048b0cbb37fead2.js": "983b76ab44587fd0b048b0cbb37fead2",
"favicon.png": "d3ddc42c7fdd34a3ede75d7786145b21",
"wallet.js": "f748751a6535c73885fa95a8a2ec015b",
"static/css/main.a3ef31b6.chunk.css": "e30ec6111df15320feca875e110c1e2f",
"static/css/2.af66ddbf.chunk.css": "868637ee54741cb7e7bdd62254bac5aa",
"static/css/main.a3ef31b6.chunk.css.map": "07a623699af9b8efd941607f4edaf5f5",
"static/css/2.af66ddbf.chunk.css.map": "65f1a1c0ac4e4d933a8fea7efdd9d4b1",
"static/js/3.7964b37d.chunk.js": "5f02c087581494a576eb6e02a54023d1",
"static/js/runtime-main.5f225b4d.js": "072cbe39c88062611fd183f3a54b307a",
"static/js/2.f3c71eb9.chunk.js.LICENSE.txt": "7c5ac2cb89522a690cc21ce092fcdd34",
"static/js/main.0a660078.chunk.js": "a1846f345ffce82f1b18ffef83021cc0",
"static/js/runtime-main.5f225b4d.js.map": "634fde7a809c93af82d91102dfac17ca",
"static/js/2.f3c71eb9.chunk.js": "380347617e396b0b3132563ca866e8b6",
"static/js/3.7964b37d.chunk.js.map": "b443f80f6fe7863383129d93a6f3514a",
"static/js/main.0a660078.chunk.js.map": "5d08393b99a703c9567912f0105bb80e",
"static/js/2.f3c71eb9.chunk.js.map": "2094943351dfe41a72856f7d77a63029",
"static/media/notification.5d015867.svg": "5bee74caefdf9d0a834915f6c8eeb259",
"static/media/notification.c392cd33.woff": "651771e1df95c807c99608188d0a4287",
"static/media/notification.3657084d.eot": "c0d3c94cd6112550c51d7d1ed13b9da1",
"static/media/notification.c5d9251e.ttf": "0b4ac1dc75df35e169b70d7719afe4cc",
"blockies.min.js": "1be09d6564c881c99894fece7f9152f8",
"precache-manifest.5f2c71f37ec96481583dd79508b71059.js": "5f2c71f37ec96481583dd79508b71059",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "b93a1b9527c0781517e94ac8a9ca9f38",
"utils.js": "95f019aae506038c9ba10d6371ad05e6",
"service-worker.js": "77834bc35eef3631ad18f7c840f5af25",
"assets/AssetManifest.json": "0af23952226a4f7338a65b1a467d1cae",
"assets/NOTICES": "935f1be3af94140b7b6d0b0ed9754b75",
"assets/FontManifest.json": "9b149012211da7c484305d153c1154eb",
"assets/AssetManifest.bin.json": "d6fad653674d74f21737e3698758a257",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "7527e628241e0e0c80a49994de88fc9f",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "9e4e0987e2b599b331273d81ec7b0c27",
"assets/fonts/MaterialIcons-Regular.otf": "0db35ae7a415370b89e807027510caf0",
"assets/assets/fonts/Poppins/Poppins-Regular.ttf": "093ee89be9ede30383f39a899c485a82",
"assets/assets/fonts/Poppins/Poppins-Bold.ttf": "08c20a487911694291bd8c5de41315ad",
"assets/assets/fonts/Gothic/Gothic-Regular.ttf": "dd266e8a31d9cbae26395f9d100e4e4b",
"assets/assets/fonts/Gothic/Gothic-Light.ttf": "37dbb4a8ec0ee8ef65071b981d27d076",
"assets/assets/fonts/Gothic/Gothic-Bold.ttf": "722cb8a1c168860d3dcfaa76cdfeda6b",
"loader.js": "4bdaa6eb033cf7876221a3edcb15281a",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
