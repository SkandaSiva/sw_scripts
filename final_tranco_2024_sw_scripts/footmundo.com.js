const WEB_URL = self.registration.scope;

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 2;

const CACHE_NAME = 'offline';

const OFFLINE_URL = WEB_URL + '/offline';


self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Setting {cache: 'reload'} in the new request will ensure that the response
    // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
    await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
    await cache.addAll([WEB_URL + '/img/home/background-index.png']);

  })());

});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Enable navigation preload if it's supported.
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {

if (checkApp()!==false) {
    appbadge('clear');
}    

      try {
        // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        console.log('Fetch failed; returning offline page instead.', error);
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }


  event.respondWith(
    caches.match(event.request).then(function(response) {
        
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );


    })());
  }

  // If our if() condition is false, then this fetch handler won't intercept the
  // request. If there are any other fetch handlers registered, they will get a
  // chance to call event.respondWith(). If no fetch handlers call
  // event.respondWith(), the request will be handled by the browser as if there
  // were no service worker involvement.
});


let notification = false;
self.addEventListener('push', function(event) {
    notification = JSON.parse(event.data.text());

    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
    if (event.data) {

if (notification.data.notnum && notification.data.notnum>0) {
appbadge('set',notification.data.notnum);
}else{
appbadge('set');
}

        const title = notification.title;
        const options = {
            body: notification.body,
            icon: notification.icon,
            badge: notification.badge,
            tag: notification.tag,
            data: {info: notification.data}/*,
            url: notification.url,
            renotify: notification.data.renotify*/

        };

        event.waitUntil(self.registration.showNotification(title, options));
    }
});

self.addEventListener('notificationclick', function(event) {

if (event.notification) {
    var notification = event.notification;

  //if (action === 'close') {
    //notification.close();
  //}else{

    //console.log('[Service Worker] Notification click Received.');
    p_link = WEB_URL + 'push_notification/';

    if (notification.data.info.nid) {
    notification_id = notification.data.info.nid;
    }else{
    notification_id = notification.data.info;
    }

    if (notification_id>0) {
    npid = { push_id: notification_id };
    }else{
    npid = { push_id: 0 };
    }

let pn_link = p_link;

    event.waitUntil((async () => {
  try {
    const response = await fetch(p_link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(npid),
    }).then(response => {
    return response.json();
  }).then(r => {
    pn_link = r.rlink;
  })
  } catch (e) {
    console.error(e);
  }

    clients.openWindow(pn_link);
        event.notification.close();

})());


//}

}


});


self.addEventListener("message", function(event) {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});


function confirmApp() {

if (navigator.standalone) {
// PWA installed
return true;
}else{
// PWA not installed
return false;
}


}



function checkApp() {

if ("setAppBadge" in navigator && "clearAppBadge" in navigator) {
return true;
}else{
return false;
}


}



function appbadge(action,num=0) {

if (checkApp()!==false) {

if (action=='set') {

navigator.setAppBadge(num).catch((error)=> {
console.log('Badge set error');
});

}else{

navigator.clearAppBadge().catch((error) => {
console.log('Badge clear error');
});

}


return true;

}else{
return false;
}


}
