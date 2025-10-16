const CACHE_DYNAMIC_NAME = 'dynamic-v10';
const CACHE_STATIC_NAME = 'static-v10';
const CACHE_DYNAMIC_LIMIT = 120;

function limparCache(cacheName, numeroItems) {
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      if (keys.length > numeroItems) {
        cache.delete(keys[0]).then(() => {
          limparCache(cacheName, numeroItems);
        });
      }
    });
  });
}

self.addEventListener('install', (e) => {
  const cacheProm = caches.open(CACHE_STATIC_NAME).then((cache) => {
    return cache.addAll([
      'https://www.agrotama.com.br/novo/js/all.js',
      'https://www.agrotama.com.br/novo/js/jquery.min.js',
      'https://www.agrotama.com.br/novo/js/bootstrap.min.js',
      'https://www.agrotama.com.br/css/neemu-styles.css',
      'https://www.agrotama.com.br/css/neemu-styles-agt-novo.css',
      'https://www.agrotama.com.br/canais-novo/css/style.css',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
      'https://www.agrotama.com.br/canais/animacao-index/assets/owlcarousel/assets/owl.carousel.min.css',
      'https://www.agrotama.com.br/canais/animacao-index/assets/owlcarousel/assets/owl.theme.default.min.css',
      'https://www.agrotama.com.br/canais/animacao-index/assets/owlcarousel/owl.carousel.js',
    ]);
  });

  e.waitUntil(cacheProm);
});

self.addEventListener('activate', (e) => {
  //console.log('SW: ativado')
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  if (url.pathname.endsWith('.php')) {
    return;
  }

  const resposta = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    }

    return fetch(e.request)
      .then((newResp) => {
        if (
          /\.(gif|jpe?g|tiff|png|webp|bmp|svg|js|css|svg)$/i.test(
            e.request.url
          )
        ) {
          if (
            !/(shoptarget|retarget|ckies|linximpulse|.asp|ckies|asp)$/i.test(
              e.request.url
            )
          ) {
            const responseToCache = newResp.clone();

            caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
              cache.put(e.request, responseToCache);
              limparCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
            });
          }
        }

        return newResp;
      })
      .catch((err) => {
        console.log('error:', err);
      });
  });

  e.respondWith(resposta);
});
