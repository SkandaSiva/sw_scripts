function sw() {
  var me = this;

  me.init = function() {

    me.debug = 1;
    me.debugStyle = 'background: blue; color: #fff; padding: 5px;';
    me.t0 = performance.now();
    me.log = function(msg) {
      if (me.debug == 1) console.log('%c [SW] ' + msg + ' - time:' + (performance.now() - me.t0), me.debugStyle);
    };

    importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js');
    workbox.setConfig({
      debug: false
    });
    workbox.skipWaiting();

    if (workbox) {
      me.log('[workbox] is loaded');
      me.log(workbox);

      workbox.routing.registerRoute(
        /^https:\/\/www\.studenti\.it.*\.(jpg|jpeg|png|gif|svg)/, //immagini da rilascio, non le dinamiche, che stanno invece su cdn
        workbox.strategies.cacheFirst({
          cacheName: 'st-images-interne',
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: 60,
              maxAgeSeconds: 24 * 60 * 60 * 30 // 30 Days
            })
          ],
        })
      );

      workbox.routing.registerRoute(
        /https:\/\/cdn\.studenti\.stbm\.it.*(jpg|jpeg|png|gif|svg)/,
        workbox.strategies.staleWhileRevalidate({
          cacheName: 'st-images-cdn',
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: 60
            })
          ]
        })
      );

      workbox.routing.registerRoute(
        /.*\.css/,
        workbox.strategies.cacheFirst({
          cacheName: 'st-css-interni-cache'
        })
      );

      workbox.routing.registerRoute(
        /^https:\/\/((?!www\.studenti).)*\.css/,
        workbox.strategies.staleWhileRevalidate({
          cacheName: 'st-css-esterni-cache',
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: 80
            })
          ]
        })
      );

      workbox.routing.registerRoute(
        /^https:\/\/www\.studenti\.it.*\.js/,
        workbox.strategies.cacheFirst({
          cacheName: 'st-js-interni-cache',
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: 80
            })
          ]
        })
      );


      workbox.routing.registerRoute(
        /^https:\/\/((?!www\.studenti).)*\.js/,
        workbox.strategies.staleWhileRevalidate({
          cacheName: 'st-js-esterni-cache',
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: 80
            })
          ]
        })
      );

      workbox.routing.registerRoute(
        new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
        workbox.strategies.cacheFirst({
          cacheName: 'st-googleapis',
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: 60
            }),
            new workbox.cacheableResponse.Plugin({
              statuses: [0, 200]
            })
          ]
        })
      );

    } else {
      me.log('[workbox] didn\'t load');
    }

  };

  me.init();
}

var serviceWorker = new sw();
