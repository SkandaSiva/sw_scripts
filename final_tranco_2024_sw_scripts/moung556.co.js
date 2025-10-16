/* eslint-disable no-unused-vars */
// The service worker script
// This script runs in the background, separate from the page

self.addEventListener('install', e => {
    // console.log('if it need to handle Service worker installed');
});
  
self.addEventListener('activate', e => {
    // console.log('if it need to handle Service worker activated');
});
  
self.addEventListener('fetch', e => {
    // console.log('if it need to handle Service worker fetching: ', event.request.url);
});