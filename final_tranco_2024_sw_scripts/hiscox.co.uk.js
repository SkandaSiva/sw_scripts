
(function(){

  var regexSet = {},
    pageURL = self.registration.scope;

  if (pageURL.indexOf('//localhost/') > 0) {
    regexSet = {
      html : new RegExp( /localhost[^\.\s]*$/ ),
      images : new RegExp( /localhost\/sites\/uk\/files\/.*\.(?:png|jpg|jpeg|svg|gif)/ ),
      css : new RegExp( /localhost.*\.(?:css)/ ),
      js : new RegExp( /localhost.*\.(?:js)/ ),
      dist_images : new RegExp( /localhost\/themes\/custom\/hiscox_uk_dc\/dist\/assets\/images\/.*\.(?:png|jpg|jpeg|svg|gif)/ ),
      fonts : new RegExp( /localhost\/themes\/custom\/hiscox_uk_dc\/dist\/assets\/fonts\/.*/ ),
    };
  } else if (pageURL.indexOf('//uat.hiscox.co.uk/')) {
    regexSet = {
      html : new RegExp( /:\/\/uat\.hiscox\.co\.uk[^\.\s]*$/ ),
      images : new RegExp( /:\/\/uat\.hiscox\.co\.uk\/sites\/uk\/files\/.*\.(?:png|jpg|jpeg|svg|gif)/ ),
      css : new RegExp( /:\/\/uat\.hiscox\.co\.uk.*\.(?:css)/ ),
      js : new RegExp( /:\/\/uat\.hiscox\.co\.uk.*\.(?:js)/ ),
      dist_images : new RegExp( /:\/\/uat\.hiscox\.co\.uk\/themes\/custom\/hiscox_uk_dc\/dist\/assets\/images\/.*\.(?:png|jpg|jpeg|svg|gif)/ ),
      fonts : new RegExp( /:\/\/uat\.hiscox\.co\.uk\/themes\/custom\/hiscox_uk_dc\/dist\/assets\/fonts\/.*/ ),
    };
  } else if (pageURL.indexOf('//hiscox.co.uk/')) {
    regexSet = {
      html : new RegExp( /:\/\/hiscox\.co\.uk[^\.\s]*$/ ),
      images : new RegExp( /:\/\/hiscox\.co\.uk\/sites\/uk\/files\/.*\.(?:png|jpg|jpeg|svg|gif)/ ),
      css : new RegExp( /:\/\/hiscox\.co\.uk.*\.(?:css)/ ),
      js : new RegExp( /:\/\/hiscox\.co\.uk.*\.(?:js)/ ),
      dist_images : new RegExp( /:\/\/hiscox\.co\.uk\/themes\/custom\/hiscox_uk_dc\/dist\/assets\/images\/.*\.(?:png|jpg|jpeg|svg|gif)/ ),
      fonts : new RegExp( /:\/\/hiscox\.co\.uk\/themes\/custom\/hiscox_uk_dc\/dist\/assets\/fonts\/.*/ ),
    };
  }

  // Import WorkBox
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

  if(workbox){

    // Triggers modules loading before routines
    workbox.loadModule('workbox-strategies');
    workbox.loadModule('workbox-routing');
    workbox.loadModule('workbox-expiration');
    workbox.loadModule('workbox-precaching');
    workbox.loadModule('workbox-cacheable-response');

    // Initiate configurations
    workbox.core.skipWaiting();
    workbox.core.clientsClaim();
    workbox.precaching.cleanupOutdatedCaches();

    // Handles HTML Caching - uses StaleWhileRevalidate
    workbox.routing.registerRoute(
      regexSet.html,
      new workbox.strategies.NetworkFirst({
          cacheName: 'hiscox:html',
          plugins: [
            new workbox.expiration.Plugin({maxAgeSeconds: 30 * 60,}), // 30min
            new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
          ]
      })
    );

    // Handles Drupal Media files Caching - uses StaleWhileRevalidate
    workbox.routing.registerRoute(
      regexSet.images,
      new workbox.strategies.StaleWhileRevalidate({
          cacheName: 'hiscox:media',
          plugins: [
            new workbox.expiration.Plugin({maxEntries: 30}), // 30 images entries
            new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
          ]
      })
    );

    // Handles CSS Caching - uses StaleWhileRevalidate
    workbox.routing.registerRoute(
      regexSet.css,
      new workbox.strategies.StaleWhileRevalidate({
          cacheName: 'hiscox:css',
          plugins: [
            new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
          ]
      })
    );

    // Handles JS Caching - uses StaleWhileRevalidate
    workbox.routing.registerRoute(
      regexSet.js,
      new workbox.strategies.StaleWhileRevalidate({
          cacheName: 'hiscox:js',
          plugins: [
            new workbox.expiration.Plugin({maxEntries: 30}), // 30 js entries
            new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
          ]
      })
    );

    // Handles Fonts Caching - uses StaleWhileRevalidate
    workbox.routing.registerRoute(
      regexSet.fonts,
      new workbox.strategies.StaleWhileRevalidate({
          cacheName: 'hiscox:fonts',
          plugins: [
            new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
          ]
      })
    );


    // Handles Fonts Caching - uses StaleWhileRevalidate
    workbox.routing.registerRoute(
      regexSet.dist_images,
      new workbox.strategies.StaleWhileRevalidate({
          cacheName: 'hiscox:dist_images',
          plugins: [
            new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
          ]
      })
    );
  }


  

}());
