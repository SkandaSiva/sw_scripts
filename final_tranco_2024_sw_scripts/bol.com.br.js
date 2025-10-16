importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.2/workbox-sw.js');

workbox.setConfig({
  debug: false,
});

workbox.loadModule('workbox-cacheable-response');

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.AreaStorage = self.AreaStorage || [];

self.AreaStorage.push({
  config: {
    cacheName: '[HomeBOL:vueland][ASSETS]',
    strategy: 'StaleWhileRevalidate',
    plugins: {
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 7 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      },
    }
  },
  cache: {
    precache: [],
    assets: [
      {
        url: /https?:\/\/c\.jsuol\.com\.br\/.*\?loadComponent=(Media|media).*contentType=(css|js).*/,
      },
      {
        url: /assets\/\?loadComponent=Media.*contentType=(css|js).*/,
      },
      {
        url: /https?:\/\/(conteudo\.)?jsuol\.com\.br\/p\/perfil\/css\/.*css.*/,
      },
    ]
  }
});

self.AreaStorage.push({
  config: {
    cacheName: '[HomeBOL:vueland][FONT]',
    strategy: 'CacheFirst',
    plugins: {
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 365 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      },
    }
  },
  cache: {
    precache: [],
    assets: [
      {
        url: /https:\/\/stc\.uol\.com\/c\/webfont\/projeto-grafico\/uol-font\/.*$/,
      },
      {
        url: /https:\/\/stc\.uol\.com\/c\/webfont\/projeto-grafico\/uol-icones-e-setas\/.*$/,
      },
    ]
  }
});

self.AreaStorage.push({
  config: {
    cacheName: '[HomeBOL:vueland][LAYOUT]',
    strategy: 'CacheFirst',
    plugins: {
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      },
    }
  },
  cache: {
    precache: [],
    assets: [
      {
        url: /https:\/\/(conteudo\.)?imguol\.com(\.br)?\/c\/home\/layout\/vueland\/.*$/,
      },
    ]
  }
});

self.AreaStorage.push({
  config: {
    cacheName: '[HomeBOL:vueland][TEAMS]',
    strategy: 'CacheFirst',
    plugins: {
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 31 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      },
    }
  },
  cache: {
    precache: [],
    assets: [
      {
        url: /https:\/\/e\.imguol\.com\/futebol\/brasoes\/.*$/,
      },
    ]
  }
});

const DEFAULT_STRATEGY = 'StaleWhileRevalidate';

const getPluginClass = function(cfg = {}) {
  const plugins = [];
  for(const plugin of Object.keys(cfg)) {
    switch(plugin) {
    case 'expiration':
      plugins.push(new workbox.expiration.ExpirationPlugin({
        ...cfg[plugin]
      }));
      break;
    }
  }
  return plugins;
};

for(const area of self.AreaStorage) {
  const {
    cache = undefined,
    config = undefined,
  } = area;

  if(config === undefined) {
    console.error(`sw: object "config" not defined`);
    continue;
  }

  if(cache === undefined) {
    console.error(`sw: object "cache" not defined`);
    continue;
  }

  // valida se a estratégia é válida
  if(workbox.strategies[config.strategy] === undefined) {
    console.error(`sw: strategy ${config.strategy} is not a valida value`);
    continue;
  }

  const plugins = getPluginClass(config.plugins);

  // evita de cachear requests Opaque (status: 0), pois eles podem ter
  // retornado erro mas o status vem como 0
  // fonte: https://cloudfour.com/thinks/when-7-kb-equals-7-mb/
  // https://developers.google.com/web/tools/workbox/modules/workbox-cacheable-response
  // https://stackoverflow.com/questions/39109789/what-limitations-apply-to-opaque-responses
  plugins.push(new workbox.cacheableResponse.CacheableResponsePlugin({
    statuses: [200],
  }));

  for(const asset of cache.assets) {
    workbox.routing.registerRoute(
      asset.url,
      new workbox.strategies[config.strategy || DEFAULT_STRATEGY]({
        cacheName: config.cacheName,
        plugins
      })
    );
  }
}
