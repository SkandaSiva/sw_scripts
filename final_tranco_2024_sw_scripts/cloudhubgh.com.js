'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "a67668cd5ab6aecd887a3c591dcaff58",
"version.json": "b0a9eaf89b46a8577916b32e7d8f79f9",
"index.html": "97d0a4bfb772ee5e46079dc7b0a9d073",
"/": "97d0a4bfb772ee5e46079dc7b0a9d073",
"logo_.png": "1538c205424e6adbedfc1fa067ea904b",
"loading.js": "80c24d19d7d6cac63fd48d6fd3d6922d",
"main.dart.js": "358a6c6a625ba9d41256b7c846ac7b46",
"404.html": "54a71dcd4ae1aa82dee68debaa173b87",
"paystack_interop.js": "da374661c872bec69852ccb36351aa1e",
"flutter.js": "7a1d76a8729d1add7a6ce2a4b4db043f",
"index.css": "cc0a90d6eb2856270db029c27b6e1a7c",
"logo__.png": "ecf839fe5d8e80ae8587473c1a8a6985",
"icons/logo_.png": "1538c205424e6adbedfc1fa067ea904b",
"manifest.json": "c2cbe403db152b16c8b6d7636c576497",
"assets/images/error__.svg": "f09958c073c2058275da10a507efbdcc",
"assets/images/background.svg": "1a0ad8e7b1c532224cc7d9cf7e5989a7",
"assets/images/mtn__.svg": "c789363951c511f899d3fb815b7f5c39",
"assets/images/buyer.png": "46d76133c16db49c7e32ef7ec8a045b7",
"assets/images/glo.jpeg": "175e94854efc3a01960cc80578753d70",
"assets/images/bad_request.svg": "16640998b40e311a0c8ff9234fde0cfe",
"assets/images/wallet.png": "3a850e62bae92d37ab8e0de058057b58",
"assets/images/person.svg": "8df4eb97f0c03b984146a8f90b98f3fc",
"assets/images/home.svg": "3e28de831d7d8bb1bc36645c01cfc5a0",
"assets/images/logo_.png": "1538c205424e6adbedfc1fa067ea904b",
"assets/images/key.png": "fe2da637d0875487bb79278ba9dfb353",
"assets/images/pend.svg": "b87f9479992ee55a97ad1adf50c1a073",
"assets/images/mtn.jpeg": "0cb24277217a7280ce50ccc287560b10",
"assets/images/empty.svg": "f5b55018c56f377d4d7d0aa4aef8dd85",
"assets/images/utility.svg": "1e5552e6aaf41a873d3dfb2ea9f2410f",
"assets/images/momo.png": "10f0981553df4bcd53ed094edeb3b3f5",
"assets/images/a_d.svg": "7bbd34d9d59cb977560cabc9dc70cc5e",
"assets/images/bills.svg": "c8dbb21859732c2b78d0dd3785ff6fbd",
"assets/images/at.svg": "341c105419f1c6c03116801ce7bd04a9",
"assets/images/blue_back.svg": "08866770e7b04c47ece9cf2972ca3616",
"assets/images/blue.png": "0ef4847a4abdcc2212f25336ef7dea61",
"assets/images/send_money.svg": "789b8ab86495967e0266d06843111a9b",
"assets/images/pin.svg": "5ff0814fef58d52f526f8beea3d8af74",
"assets/images/sms.svg": "49cc4e824df6188f751db997942361f3",
"assets/images/shop.jpg": "f188dc890a054d353e758d52e2e7ce93",
"assets/images/user.png": "033a4e56d1a9add5458bba16a1659cf8",
"assets/images/gotv.jpeg": "762b57315be94c73e9ac1c6183056991",
"assets/images/logo__.png": "ecf839fe5d8e80ae8587473c1a8a6985",
"assets/images/pattern.png": "811b976d652e4e7c91dec35e8c979fb1",
"assets/images/search.png": "de50a24cdf7a699e97c7e4401515ff4d",
"assets/images/not_allowed.svg": "70ce17e039ef117b42511d2e0fc0f804",
"assets/images/orange.png": "e11cb29012dfaff59211541bb6080e9d",
"assets/images/not_found.svg": "e34f6fe95a4d57f9e02b513ff2ba5a3c",
"assets/images/red_back.svg": "0761f9914a53f311d9fd93b934845752",
"assets/images/notification.svg": "668fd43b835535ea442695212c8c08f9",
"assets/images/green.png": "f728b97717ef243c3d8600dbf5c77c7d",
"assets/images/404.json": "14d767826bd67cc8d4712dfe478aeca1",
"assets/images/green_back.svg": "55c92b099c284e5e70be6d5f66976d39",
"assets/images/orange_back.svg": "207249c1849ab12e360f5ca5fed91f71",
"assets/images/passcodes.png": "a4856292a92f77f2249a6b534897d2e2",
"assets/images/cash.svg": "e8fedd046912aa9dffd1d2dd50613b01",
"assets/images/program.svg": "11e75a37209c366f7717611817a57ea8",
"assets/images/paystack.png": "769ee98d36185e1569f706ff98416dfd",
"assets/images/airtime.svg": "a5991c73149ff64c79a74d0851e7fa71",
"assets/images/pay_tv.svg": "a5170a34b4509b8143ae42ed8b55f150",
"assets/images/mtn_.png": "bc43367a86d8fb9ee822cf4d46a17418",
"assets/images/bck.png": "1c63d5e035be5298bc84369b8d943272",
"assets/images/inv.svg": "568db9677301f58d46821a27606de4f2",
"assets/images/trans.svg": "82e3bb3da94d6cef928679a9c424e3e5",
"assets/images/data.svg": "74ef76f190b3c1d9dbddd7cc0725ba0d",
"assets/images/truck.png": "e5036b1d8f1d06ddc3aa19ff495e7799",
"assets/images/error.svg": "41fc1f7898bc3e49e59a0f8a9e0a3da6",
"assets/images/invoice.svg": "568db9677301f58d46821a27606de4f2",
"assets/images/voda.jpeg": "b28e6b88f8a3226e6527cb245dafca44",
"assets/images/excel.svg": "9cae63f953dab1bdbe1f1bd2e78504e2",
"assets/images/send.png": "1dfc82eb0a0b0402369010f780abb78c",
"assets/images/id.svg": "d23e879b871dbaa46e771c209c36015e",
"assets/images/powered.png": "0ab6041666e5dad42b7fcbae6379c027",
"assets/images/red.png": "52373d6eddad2c2d523dfd2e38a7f890",
"assets/images/pending.png": "f08b0ee7b58d2fbe09d01b5a18ca220f",
"assets/images/welcome.png": "d1961fcde585d39baf3d1c4a23c7ca9c",
"assets/images/at.jpeg": "9dbd6f92d67fb400819afd601421e70b",
"assets/AssetManifest.json": "74279851b492a493a824e73b586ee70d",
"assets/NOTICES": "448debb48db519c10b4f115b7e814fe3",
"assets/FontManifest.json": "9e682c45bc20f46018c4666d7af54eac",
"assets/AssetManifest.bin.json": "a231905b79af61f207e264e36e608251",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "85b6a526f01ee0b76b311e821294c5db",
"assets/packages/fluttericon/lib/fonts/Octicons.ttf": "7242d2fe9e36eb4193d2bc7e521779bf",
"assets/packages/fluttericon/lib/fonts/Maki.ttf": "9ecdcd7d24a2461a55d532b86b2740bd",
"assets/packages/fluttericon/lib/fonts/Brandico.ttf": "791921e9b25210e2551b6eda3f86c733",
"assets/packages/fluttericon/lib/fonts/Entypo.ttf": "58edfaf27b1032ea4778b69297c02b5a",
"assets/packages/fluttericon/lib/fonts/Fontelico.ttf": "3a1e1cecf0a3eae6be5cba3677379ba2",
"assets/packages/fluttericon/lib/fonts/Iconic.ttf": "34e12214307f5f7cf7bc62086fbf55a3",
"assets/packages/fluttericon/lib/fonts/LineariconsFree.ttf": "9606898584a3ca9a59d82a82626ad5eb",
"assets/packages/fluttericon/lib/fonts/RpgAwesome.ttf": "99232001effca5cf2b5aa92cc3f3e892",
"assets/packages/fluttericon/lib/fonts/Typicons.ttf": "3386cae1128e52caf268508d477fb660",
"assets/packages/fluttericon/lib/fonts/FontAwesome.ttf": "f4129dc4687db3424426f77209eeda56",
"assets/packages/fluttericon/lib/fonts/Zocial.ttf": "c29d6e34d8f703a745c6f18d94ce316d",
"assets/packages/fluttericon/lib/fonts/WebSymbols.ttf": "4fd66aa74cdc6e5eaff0ec916ac269c6",
"assets/packages/fluttericon/lib/fonts/Linecons.ttf": "2d0ac407ed11860bf470cb01745fb144",
"assets/packages/fluttericon/lib/fonts/FontAwesome5.ttf": "221b27a41202ddd33990e299939e4504",
"assets/packages/fluttericon/lib/fonts/Elusive.ttf": "23f24df0388819e94db2b3c19841841c",
"assets/packages/fluttericon/lib/fonts/MfgLabs.ttf": "09daa533ea11600a98e3148b7531afe3",
"assets/packages/fluttericon/lib/fonts/Meteocons.ttf": "8b9c7982496155bb39c67eaf2a243731",
"assets/packages/fluttericon/lib/fonts/ModernPictograms.ttf": "5046c536516be5b91c15eb7795e0352d",
"assets/packages/syncfusion_flutter_datagrid/assets/font/FilterIcon.ttf": "b8e5e5bf2b490d3576a9562f24395532",
"assets/packages/syncfusion_flutter_datagrid/assets/font/UnsortIcon.ttf": "acdd567faa403388649e37ceb9adeb44",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "1c3f50fae9039dcbc61c2ddfa10b6c55",
"assets/fonts/MaterialIcons-Regular.otf": "8120df335a784d83a149ff6cc6efcbd5",
"assets/assets/font/semi.ttf": "38257ec36f55676f98fcdf1264adb69d",
"assets/assets/font/font.ttf": "ea0ad4c72a135f9a43ec7bb83f2469aa",
"assets/assets/font/extra_bold.ttf": "5b5a206f5cd32fa496c93925d0caf609",
"assets/assets/font/bold.ttf": "ba43cdecf9625c0dcec567ba29555e15",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
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
