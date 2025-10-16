importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@4.3.1/workbox/workbox-sw.js')

workbox.setConfig({
  "debug": false
});
// Start controlling any existing clients as soon as it activates
workbox.core.clientsClaim()

// Skip over the SW waiting lifecycle stage
workbox.core.skipWaiting()

workbox.precaching.cleanupOutdatedCaches()

	
  workbox.routing.registerRoute(
    new RegExp('https://jlrorwxhqipjll5p\.ldycdn\.com/.*(?:png|gif|jpg|jpeg|webp|svg)$'),
    new workbox.strategies.CacheFirst({
      cacheName: 'cdn:images',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 30,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );
  workbox.routing.registerRoute(
    new RegExp('https://jlrorwxhqipjll5p\.ldycdn\.com/.*(?:js|css)$'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'cdn:cssjs',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        })
      ]
    })
  );

	
  workbox.routing.registerRoute(
    new RegExp('https://ikrorwxhqipjll5p\.ldycdn\.com/.*(?:png|gif|jpg|jpeg|webp|svg)$'),
    new workbox.strategies.CacheFirst({
      cacheName: 'cdn:images',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 30,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );
  workbox.routing.registerRoute(
    new RegExp('https://ikrorwxhqipjll5p\.ldycdn\.com/.*(?:js|css)$'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'cdn:cssjs',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        })
      ]
    })
  );

	
  workbox.routing.registerRoute(
    new RegExp('https://rjrorwxhqipjll5p\.ldycdn\.com/.*(?:png|gif|jpg|jpeg|webp|svg)$'),
    new workbox.strategies.CacheFirst({
      cacheName: 'cdn:images',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 30,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );
  workbox.routing.registerRoute(
    new RegExp('https://rjrorwxhqipjll5p\.ldycdn\.com/.*(?:js|css)$'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'cdn:cssjs',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        })
      ]
    })
  );


// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);


workbox.routing.registerRoute(
  /\.html$/,
  new workbox.strategies.NetworkFirst ({
  networkTimeoutSeconds: 5,
  cacheName:'html-caches',
  plugins: [
    new workbox.cacheableResponse.Plugin({
      statuses: [0, 200]
    }),
    new workbox.expiration.Plugin({
      maxEntries: 30,
      maxAgeSeconds: 10 * 60 * 60
    })
  ]
}), 'GET');
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
      }),
    ],
  })
);