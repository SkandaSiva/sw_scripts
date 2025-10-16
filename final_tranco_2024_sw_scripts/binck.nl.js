'use strict';

// Incrementing OFFLINE_VERSION will kick off the install event and force
const OFFLINE_VERSION = 1.5;
const CACHE_NAME = 'offline';
// Customize this with a different URL if needed.
const OFFLINE_URL = './offline/index.html';
const assets = ['-/media/global/logos/saxobank/saxobank.svg'];

self.addEventListener('install', (event) => {  
    event.waitUntil((async () => {
        // Saving in application cache 
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll([...assets, OFFLINE_URL]);
    })());
});


self.addEventListener('fetch', (event) => {
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.   
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                // Always try the network first.
                return await fetch(event.request);               
            } catch (error) {
                // catch is only triggered if an exception is thrown       
                return  caches.match(OFFLINE_URL);            
            }
        })());
    } else {
        // Respond with Other type of requests and cached assets    
        event.respondWith((async () => {
            try {
                return  await fetch(event.request);                
            } catch (error) {
               return  caches.match(event.request);
                
            }

        })())
    }

});