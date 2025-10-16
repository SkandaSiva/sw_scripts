
const urlToOpen = new URL("/", self.location.origin).href;
const clientIdToClientData = {};
// Clean out dead clients from clientIdToClientData
const cleanseClientData = async () => {
  const clientList = await self.clients.matchAll({includeUncontrolled: true, type: 'window'});
  const currentClientIds = new Set(clientList.filter(client => !!client).map(client => client.id));
  const oldClientIds = Object.keys(clientIdToClientData);
  for (const oldClientId of oldClientIds) {
    if (!currentClientIds.has(oldClientId)) {
      delete clientIdToClientData[oldClientId];
    }
  }
};

// Listen for messages from client -> SW
self.addEventListener('message', event => {
  const { data: { command } } = event;
  //console.log('SW - On message ', event.source.id);
  if (command === 'registerClient') {
    const clientId = event.source.id;
    clientIdToClientData[clientId] = {};

    // Find any old client registrations that are no longer valid and delete them
    event.waitUntil(
      cleanseClientData(),
    );
  }
});

function isClientFocused() {
  return clients.matchAll({includeUncontrolled: true,
    type: 'window'
  })
  .then((windowClients) => {
    let clientIsFocused = false;

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.focused && windowClient.id in clientIdToClientData) {
        clientIsFocused = true;
        break;
      }
    }

    return clientIsFocused;
  });
}
const push = async (dataJSON) =>
{
  hideNotification = false;
  if ("perso" in dataJSON && "checkfocus" in dataJSON.perso && dataJSON.perso.checkfocus)
  {
    try
    {
    hideNotification = await isClientFocused();
    }catch (e) {
      console.error(e);
    }
  }
  if (!hideNotification)  
  {
    try
    {
      await self.registration.showNotification(dataJSON.title, dataJSON.options);
      logInteraction(dataJSON.options.data.trackid,"show");
    }catch (e) {
    console.error(e);
    }
    
  }
}
const logInteraction = async (trackid,event) => {
   const endpoint = '/swtracker.php';
   const request = {
     headers: {
       'Content-Type': 'application/json',
     },
     method: 'POST',
     body: JSON.stringify({
      trackid:trackid,
      event: event
     }),
   };

   try {
     await fetch(endpoint, request);
   } catch (e) {
     console.error(e);
   }
}


const notificationclick = async (notification) => 
{
  if ("data" in notification && "link" in notification.data && notification.data.link!="")
  {
    if (clients.openWindow) {
      try 
      {
        clients.openWindow(notification.data.link);
        await logInteraction(notification.data.trackid,"open");
      } catch (e) {
        console.log(e); 
      }
    }
  }
  else
  {
    const clientList = await self.clients.matchAll({includeUncontrolled: true,type: 'window'});
    const client = clientList.find(client => !!client && (client.id in clientIdToClientData) && "focus" in client);
    if (client)
    {
      try 
      {
        client.focus();
        await logInteraction(notification.data.trackid,"focused");
      } catch (e) {
        console.log(e); 
      }
      if ("data" in notification && "clientmsg" in notification.data && notification.data.clientmsg!="")
      {
          await client.postMessage(notification.data.clientmsg);
      }
    }
    else if (clients.openWindow) 
    {
      try 
      {
        if (await clients.openWindow(urlToOpen))
          await logInteraction(notification.data.trackid,"open");
      } catch (e) {
        console.log(e); 
      }
    }
  }
}

self.addEventListener('push', function(event) {
  const dataJSON = event.data.json();
  event.waitUntil(
    logInteraction(dataJSON.options.data.trackid,"rcv")
  );
  event.waitUntil(push(event.data.json()));  
});

self.addEventListener('notificationclick', function(event) {
  //console.log('On notification click: ', event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  event.waitUntil(notificationclick(event.notification));

  event.waitUntil(
    logInteraction(event.notification.data.trackid,"click")
  );
  // This looks to see if the current is already open and
  // focuses if it is

});


self.addEventListener('install', function(event) {
  self.skipWaiting();

var offlineRequest = new Request('/offline.html');
  event.waitUntil(
    fetch(offlineRequest).then(async function(response) {
      const cache = await caches.open('offline');
      return cache.put(offlineRequest, response);
    })
  );
});
/*
self.addEventListener('fetch', function(event) {

  var request = event.request;
  if (request.mode === 'navigate' && request.method === 'GET' && (request.url=="https://bazoocam.org" || request.url.slice(-1)==="/" )) {
    event.respondWith(
      fetch(request).catch(function(error) {
        return caches.open('offline').then(function(cache) {
          return cache.match('/offline.html');
        });
      })
    );
  }
});
*/

self.addEventListener('fetch', function(event) {

  var request = event.request;
  if (request.mode === 'navigate' && request.method === 'GET' && (request.url=="https://bazoocam.org" || request.url.slice(-1)==="/" )) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          return networkResponse;
        } catch (error) {
  
          const cache = await caches.open('offline');
          const cachedResponse = await cache.match('/offline.html');
          return cachedResponse;
        }
      })());
  }

});

self.addEventListener('activate', event => {
  event.waitUntil(async function() {
    await self.clients.claim();
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.disable();
    }
  }());
});