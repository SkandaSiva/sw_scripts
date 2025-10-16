importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js');

firebase.initializeApp({
	apiKey: "AIzaSyBhynUiXoimIuINinUglEBnDNLhK3i-bcw",
    authDomain: "libertad-18ee6.firebaseapp.com",
    databaseURL: "https://libertad-18ee6.firebaseio.com",
    projectId: "libertad-18ee6",
    storageBucket: "libertad-18ee6.appspot.com",
    messagingSenderId: "895650955273",
    appId: "1:895650955273:web:a3e5851e2907ddbe3c38d8",
    measurementId: "G-GQT3P15C6H"
});

self.addEventListener('push', async event => {
	const data = event.data.json().data;

	var title = data.title;	
	var options = {
	    body: data.text,
	    icon: data.icon,
	    image: data.image,
	    badge: data.badge,
	    tag: data.url,
	    data: data.imprurl
	};
	var imprUrl = [];
	var imprTracker = [];
	
	try {		
		if(data.campaign == "1"){
			// fetch for impression counts call
			if(data.campaignImpressionsURL !="" && data.campaignImpressionsURL != undefined)
				fetch(data.campaignImpressionsURL, { mode: 'no-cors', method: "POST" }).then(function(response) {
				});
			options.data = new Object();
			options.data.campaign = data.campaign;
			options.data.campaignClicksURL = data.campaignClicksURL;
			event.waitUntil(self.registration.showNotification(title, options));
		}
		else if(data.feedUrl != undefined &&  data.feedUrl != ""){	
			var paidOrganicFlag = (data.feedUrl.indexOf("ade.clmbtech.com")!=-1)?1:((data.feedUrl.indexOf("originrecadessl.clmbtech.com")!=-1)?0:-1);
			
			data.feedUrl = data.feedUrl.replace("originrecadessl.clmbtech.com",self.location.hostname);
			data.feedUrl = data.feedUrl.replace("ade.clmbtech.com",self.location.hostname+"/can");
			event.waitUntil(
					fetch(data.feedUrl, 
					{ 
						mode: 'no-cors',
						method: "GET"
					}).then(response => response.json())
					  .then(function(res){
						  console.log(res);
						  if(paidOrganicFlag == 1){
							  length = res[0].items.length-1;
							  title = res[0].items[length].name;
							  options.body = res[0].items[length].desc;
							  options.image = res[0].items[length].sImg[0];
							  options.tag = res[0].items[length].url;
							  options.data = res[0].imprUrl;
						  }
						  return self.registration.showNotification(title, options);
					  }));
		}else {
			event.waitUntil(self.registration.showNotification(title, options));
		}

		sendDataToClients('pushData');
		
		// load impression url
		if(data.imprurl !="" && data.imprurl != undefined) {
			data.imprurl = data.imprurl.replace("ade.clmbtech.com",self.location.hostname+"/can");
			imprUrl.push(data.imprurl);
			
			fetch(data.imprurl, { mode: 'no-cors' }).then(function(response) {
			});
		}
		
		// load impression tracker
		if(data.imprtracker !="" && data.imprtracker != undefined) {
			data.imprtracker = data.imprtracker.replace("ade.clmbtech.com",self.location.hostname+"/can");
			imprTracker.push(data.imprtracker);
			
			fetch(data.imprtracker, { mode: 'no-cors' }).then(function(response) {
			});
		}
	}catch(e){
		console.log('Unable to fetch impression', e);
	}
	
	// clean up impr url data
	options.data = "";
	data.imprurl = "";
	data.imprtracker = "";
});

self.addEventListener('notificationclick', async event => {
  console.log('[Service Worker] Notification click Received.');
  const data = event.notification;

  event.notification.close();

  if(data.data != null && data.data != undefined && data.data.campaign == "1"){
		// fetch for click counts call
	  if(data.data.campaignClicksURL !="" && data.data.campaignClicksURL != undefined) 
		  fetch(data.data.campaignClicksURL, { mode: 'no-cors', method: "POST" }).then(function(response) {
			});
	  	clients.openWindow(data.tag)
	}
  else if(data.feedUrl != undefined &&  data.feedUrl != "")
	  event.waitUntil(
			  clients.openWindow(data.tag.replace("ade.clmbtech.com",self.location.hostname+"/can"))
	  );
  else
	  event.waitUntil(
			  clients.openWindow(data.tag)
	  );
  
  sendDataToClients('notificationOnClick');
});

async function sendDataToClients(data) {
	const allClients = await clients.matchAll({ includeUncontrolled: true });
    for (const client of allClients) {
      client.postMessage(data);
    }
}

async function getDb() {
	if (this.db) {
		return Promise.resolve(this.db);
	}

	return new Promise(resolve => {
		const openRequest = indexedDB.open("Chuck", 1);

		openRequest.onupgradeneeded = event => {
			const db = event.target.result;
			db.createObjectStore('jokes', { keyPath: 'id' });
		};

		openRequest.onsuccess = event => {
			this.db = event.target.result;
			resolve(this.db);
		}
	});
}

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  'https://code.jquery.com/jquery-3.3.1.min.js'

];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', event => {
  console.log("(9)served from service worker: ",event.request.url);
  // serve as soon as possible from cache
  event.respondWith(fromCache(event.request));
  // update cache
  event.waitUntil(  
    update(event.request)
  );
});


/**
 * 
 * Helper methods
 */

function fromCache(request) {
  return caches.open(CACHE_NAME).then(cache => {
    return cache.match(request);
  });
}


function update(request) {
  caches.open(CACHE_NAME).then( cache => {
    fetch(request).then( response => {
      cache.put(request, response)
    });
  });
}


/*
 * messaging.setBackgroundMessageHandler(function(payload) {
 * console.log(payload); const data = payload.data.json().data;
 * 
 * const title = data.title; const options = { body: data.text, icon:
 * data.image, image: data.image, data: data.url };
 * 
 * 
 * return self.registration.showNotification(title, options); });
 */
/*
 * const CACHE_NAME = 'my-site-cache-v1'; const urlsToCache = [ ];
 * 
 * self.addEventListener('install', event => {
 * event.waitUntil(caches.open(CACHE_NAME) .then(cache =>
 * cache.addAll(urlsToCache))); });
 * 
 * self.addEventListener('fetch', event => { event.respondWith(
 * caches.match(event.request) .then(response => { if (response) { return
 * response; } return fetch(event.request); } ) ); });
 * 
 */