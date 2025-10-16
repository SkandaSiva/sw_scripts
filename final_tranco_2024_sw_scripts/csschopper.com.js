(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('sw-toolbox.js');

  // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = false;

  // We want to precache the following items
  // toolbox.precache(['index.html',
  //   'address.html',
  //   'corporate-culture.html',
  //   'corporate-culture2.html',
  //   'corporate-home.html',
  //   'menu-process.html',
  //   'my-details.html',
  //   'quiz-step.html',
  //   'quiz-step2.html',
  //   'quiz.html']);

  // The route for any requests from the googleapis origin
  // toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
  //   cache: {
  //     name: 'googleapis'
  //   },
  //   origin: /\.googleapis\.com$/,
  //   networkTimeoutSeconds: 4
  // });

  // toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
  //   cache: {
  //     name: 'fonts'
  //   },
  //   origin: /\.gstatic\.com$/,
  //   networkTimeoutSeconds: 4
  // });

  // toolbox.router.get('/assets/css/(.*)', global.toolbox.cacheFirst, {
  //   cache: {
  //     name: 'stylesheets'
  //   },
  //   networkTimeoutSeconds: 4
  // });

  // toolbox.router.get('/assets/images/(.*)', global.toolbox.cacheFirst, {
  //   cache: {
  //     name: 'images'
  //   },
  //   networkTimeoutSeconds: 4
  // });

  // toolbox.router.get('/assets/js/(.*)', global.toolbox.cacheFirst, {
  //   cache: {
  //     name: 'javascript'
  //   },
  //   networkTimeoutSeconds: 4
  // });



  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);

function getFilenameFromUrl(path) {
  path = path.substring(path.lastIndexOf("/") + 1);
  return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
}



