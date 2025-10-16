'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"favicon/menu_digital/ms-icon-144x144.png": "ab69b749de4981fc667da5549b71e47b",
"favicon/menu_digital/apple-icon-57x57.png": "f69ebd2314f77d3c6d47b6990eeafdf5",
"favicon/menu_digital/apple-icon-76x76.png": "c9344dc4127ec0911b2df60a2afd78e5",
"favicon/menu_digital/apple-icon-180x180.png": "431a0f0c2cded2e3d5f3ad91a861cdbe",
"favicon/menu_digital/favicon-16x16.png": "76947f5ae83c35df7b245e5ef718b8a6",
"favicon/menu_digital/apple-icon-120x120.png": "029ce6d207a3eebd4d69526607ff6f2a",
"favicon/menu_digital/apple-icon-144x144.png": "ab69b749de4981fc667da5549b71e47b",
"favicon/menu_digital/apple-icon-114x114.png": "b535c1e3797d1b2bd5756abbc5d5c916",
"favicon/menu_digital/apple-icon-72x72.png": "459a0db6317da725c3a5bd805963ef76",
"favicon/menu_digital/android-icon-192x192.png": "5fb47b4db31a7e8710cecdf0c1ccffb4",
"favicon/menu_digital/favicon-32x32.png": "cc321d8fa0bad4a56981b1db88408126",
"favicon/menu_digital/apple-icon-60x60.png": "e24585a4c8e81190746b3fcaeda72a44",
"favicon/menu_digital/apple-icon-152x152.png": "06e93d7b633f7124918cfa20519d808d",
"favicon/menu_digital/favicon-96x96.png": "d01cb2e7da2a46725e1776bde9f20d6b",
"favicon/catalogo_online/ms-icon-144x144.png": "bafe32102ea8e16b8352d7b27109fdd5",
"favicon/catalogo_online/apple-icon-57x57.png": "4d9dff409cf3a65d3433dc44bf0a9420",
"favicon/catalogo_online/apple-icon-76x76.png": "19a4e00e5dd28e7fd257bf618522b5fd",
"favicon/catalogo_online/apple-icon-180x180.png": "61127120e51c68d56b6dd5cd92798833",
"favicon/catalogo_online/favicon-16x16.png": "9c50bcbd4520fe30f1f773fd09013083",
"favicon/catalogo_online/apple-icon-120x120.png": "379684a714586e8f032de075ccb19c67",
"favicon/catalogo_online/apple-icon-144x144.png": "bafe32102ea8e16b8352d7b27109fdd5",
"favicon/catalogo_online/apple-icon-114x114.png": "c597f9084c308ee639d4606163596adb",
"favicon/catalogo_online/apple-icon-72x72.png": "86e211f5763ab22959734b3a18628a7b",
"favicon/catalogo_online/android-icon-192x192.png": "aad9d3a53c91b106bcfaadb0c4046041",
"favicon/catalogo_online/favicon-32x32.png": "92388967c0dad0f57cb5338178a1faf7",
"favicon/catalogo_online/apple-icon-60x60.png": "dd24d50a39e3f490bf7b974694a4d4fd",
"favicon/catalogo_online/apple-icon-152x152.png": "6aec3e192a959f91b572121dd534d893",
"favicon/catalogo_online/favicon-96x96.png": "ad6498968b2cee2429c81b6583a8d30b",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"main.dart.js": "800acf36f5f6bbdfcf1e78abad8974ad",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin": "4d74ebcacd6915a58cb6cea85ff95868",
"assets/fonts/MaterialIcons-Regular.otf": "bc3b900591e3c5478f808667beda5237",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/assets/gifs/loader.gif": "a8511bb5d23bed11be7f8b44fcb4714d",
"assets/assets/icon/pin.svg": "f87546cd6ad5c4a42d5deb588618242b",
"assets/assets/icon/mais.svg": "9bafa4c5cce909d7a05bc09bd2a9b7ef",
"assets/assets/icon/seta_cima.svg": "bff3bb188e50688ce44a7ae239374c41",
"assets/assets/icon/placeholder.svg": "bd37846d0f66c9e631692b014aad50d2",
"assets/assets/icon/carrinho.svg": "5fe39dc76ac5e3860c71484f0001a301",
"assets/assets/icon/loja.svg": "9a99af1e04b5563f07c06f01b5f84be3",
"assets/assets/icon/topo.svg": "9eb812dd802b9ffc1643fc928e4fafba",
"assets/assets/icon/pedido_enviado.svg": "b2f5bac8be49fe9c8d89b630c6209da5",
"assets/assets/icon/erro_404.svg": "9872a3836dda4c3d6c41622e49290be5",
"assets/assets/icon/buscaVazia.svg": "e02f7b7415836088e9b07d953313d516",
"assets/assets/icon/seta_baixo.svg": "6fe17a529faab52c7d87667296960676",
"assets/assets/icon/contato.svg": "cb5fc4976c4b3935be58400932fb9599",
"assets/assets/icon/lupa.svg": "063819b134596a7f755d2988707744ab",
"assets/assets/icon/carrinho_vazio.svg": "4f60139eed15f7e37a62a9a088cca2c8",
"assets/assets/icon/fechar.svg": "8e4ca813fc7be36b5194d03181580929",
"assets/assets/icon/loja_colorida.svg": "53d34e1f4c1ee6345a7487b15574905b",
"assets/assets/icon/menu.svg": "15e8f7d3594396d59068115bf9124b10",
"assets/assets/icon/lista.svg": "ec24dd46acae34c43ab607ea0a549002",
"assets/assets/icon/voltar.svg": "035c50d10a7567c091ab1ef9faef3bc1",
"assets/assets/icon/menos.svg": "2814aeb31157d4d9fe16de4048293de2",
"assets/assets/icon/grade.svg": "9994ece5d870184bc52aba56a4660280",
"assets/assets/icon/horario.svg": "b001175f093f3a6e3d440c0b4b9f54e1",
"assets/assets/icon/erro.svg": "89eda04f8233b5666d31fdfde4085949",
"assets/assets/icon/expirado.svg": "79baa9cec5565c50433dfd26be892e78",
"assets/assets/mock/capuccino.png": "f96eead240091197dd017914c30a4c15",
"assets/assets/mock/cafe_expresso.png": "d5de655828f277bcc3e410a241536f49",
"assets/assets/mock/uma-xicara-de-cafe.png": "203eb37ac6bffedcab132bd506331f07",
"assets/NOTICES": "52926dfe1d3407030a15f7d29266ae13",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.json": "2956ec597f398edf927a48d74bf67ec1",
"assets/css/style.css": "ae90651ad4df999e40a17e8edaee439f",
"assets/AssetManifest.bin.json": "0a3960576cf78d3818f417e5357d2b6f",
"index.html": "1e93480cb479a05d33c66f243326c10d",
"/": "1e93480cb479a05d33c66f243326c10d",
"app.html": "42c8e0370790446bcf57917172096ffe",
"manifest.json": "272168641f84c81c900ac079d470a3ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"manifest.menudital.json": "582d9a2670c244385869a8d487380a62",
".well-known/assetlinks.json": "c0ee3697e061b2a932c98845b2e08c60",
"icons/icon_menu_digital_512px.png": "3547433a1e4a70d9d30d92083f37dae1",
"icons/icon_menu_digital_192px.png": "36d4c0d28283d1e50caacbd72aa3d8ad",
"icons/icon_catalogo_online_192px.png": "4ca6125972c5b4017984afef7221a449",
"icons/icon_catalogo_online_512px.png": "ad8d41314fc6afde9d31b3da94b3d5cf",
"index.menudigital.html": "4fcb63d7ac8444ab6d18c11992e8a90f",
"version.json": "4a88323ff5b9fdad9dfc7fbc5a0a04d2",
"flutter_bootstrap.js": "b0ebdba1ef346b5ae0007c55c361fe0c"};
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
