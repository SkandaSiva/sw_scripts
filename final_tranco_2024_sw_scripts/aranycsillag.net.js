"use strict";

var version = 'v1c:0:15';

var offlineFundamentals = [    
  'manifest2.json',  
  'wp-content/themes/arany/style.min.css',
  'wp-content/themes/arany/js/aranyc.js'  
];

self.addEventListener("install", function(event) {  
   event.waitUntil(
     caches.open(version + 'fundamentals')
      .then(function(cache) {
        return cache.addAll(offlineFundamentals);
      })     
  );
});

self.addEventListener('fetch', function(event) {
var request=event.request;
if (request.method !== 'GET') {       
    return;
  }

event.respondWith(    
    caches.open(version + 'fundamentals').then(function(cache) {
        return cache.match(request).then(function(response) {        
        if (response) {
          return response;
        }
        
		return fetch(request.clone()).then(function(response) {
          
          if (response.status < 400 && (
              request.url.indexOf('/uploads/')>-1 || request.url.indexOf('/themes/arany')>-1 || request.url.indexOf('manifest')>-1 || request.url.indexOf('logo-icon')>-1)) {  
            cache.put(request, response.clone());
          } 
          
          return response;
        })
		.catch(function() {                    
                    return new Response('<!DOCTYPE html><html lang="hu-HU" prefix="og: http://ogp.me/ns#"><head><meta http-equiv="Content-type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes" /><meta name="theme-color" content="#7fbef4"><title>Nincs internet kapcsolat - aranycsillag.net</title><style>body{line-height:1.5;padding: 20px 0;background: #FFFBE0;font-family:Arial, Roboto, "Helvetica Neue", Helvetica, sans-serif;font-size:18px}#m{margin: auto;border-radius: 10px;padding: 10px;box-shadow: 0 0 3px 3px rgba(127,127,127,.25);background-color: #7FBEF4;}#c{background: #FFF;padding: 1em;}.e{color:#2F84A1}.gombok{cursor:pointer;background:#ecf9ff;color:#1F7DB3;font-weight:700;border:1px solid #8ebad7;padding:10px;border-radius:5px;font-size:24px}.gombok:hover{background:#d0f1ff;color:#45A108}</style></head><body><div id="m"><div id="c"><h1 class="e">Megszakadt az internet kapcsolat?</h1><p>Újrapróbálkozáshoz:</p> <a href=""><button class="gombok"> kattints ide </button></a></div></div> </body></html>', { headers: { 'Content-Type': 'text/html', 'Cache-Control':
'no-cache, must-revalidate, max-age=0' }});
     });
       }
      );	 
    })
);
});

self.addEventListener("activate", function(event) {   
  event.waitUntil(
    caches      
      .keys()
      .then(function (keys) {       
        return Promise.all(
          keys
            .filter(function (key) {              
              return !key.startsWith(version);
            })
            .map(function (key) {              
              return caches.delete(key);
            })
        );
      })      
  );
});
