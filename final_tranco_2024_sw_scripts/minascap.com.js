/**
 * Check out https://googlechrome.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */

 importScripts('https://www.gstatic.com/firebasejs/7.5.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/7.5.0/firebase-messaging.js');
'use strict';
importScripts('./build/sw-toolbox.js');

firebase.initializeApp({
  apiKey: "AIzaSyDtWD4RfOAmvgo-w1U0KtlWGQa6W_QKq_s",
  authDomain: "minascap-53b4b.firebaseapp.com",
  databaseURL: "https://minascap-53b4b-default-rtdb.firebaseio.com",
  projectId: "minascap-53b4b",
  storageBucket: "minascap-53b4b.appspot.com",
  messagingSenderId: "382489343329",
  appId: "1:382489343329:web:f26e59c9f81c32b4234120",
  measurementId: "G-ZWGSP27M7J"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  //console.log('Received background message ', payload);
  // here you can override some options describing what's in the message; 
  // however, the actual content will come from the Webtask
  const notificationOptions = {
    icon: '/assets/img/icon-192x192.png'
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});



self.toolbox.options.cache = {
  name: 'ionic-cache',
  maxEntries: '64',
  maxAgeSeconds: '36000',
  ops: {
    interval: 1000
  },
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        log: '*',
        response: '*'
      }]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
};

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/vendor.js',
    './build/main.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
  ]
);

// dynamically cache any other local assets
//self.toolbox.router.any('/*', self.toolbox.fastest);
self.toolbox.router.any('/*', self.toolbox.networkFirst);
// self.toolbox.router.any('/*', self.toolbox.cacheFirst);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkOnly;
