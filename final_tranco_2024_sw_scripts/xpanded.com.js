"use strict";

/**
 * The service worker for root
 * 
 */

/**
 * An indexedDB to hold the current endpoint(token)
 */

var PNDB = Object();
PNDB.Settings = {
	dbName: 'push_subscription',
	dbObjectStore: 'subscriptions'
};


PNDB.addToken = function(token) {

	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	
	if (!window.indexedDB) { 
		console.log("indexedDB not supported.");
	} else {
	
		var request = indexedDB.open(PNDB.Settings.dbName, 2);
		
		//Error
		request.onerror = function(event) { console.log("IndexedDB failed to open: ", event);};
		
		//Upgrade
		request.onupgradeneeded = function (event){
			var db = event.target.result;
			
			db.onerror = function(event){ console.log('Error loading database');};
			
			//Nothing tricky here			
		    var objectStore = db.createObjectStore(PNDB.Settings.dbObjectStore, { autoIncrement : true });
		    
		};
		
		//Success
		request.onsuccess = function(event) {
			var db = event.target.result;
		
			db.onerror = function(event) { console.log("IndexedDB Error: ", event.target.errorCode); };
			
			var trans = db.transaction([PNDB.Settings.dbObjectStore], "readwrite");
			
			trans.oncomplete 	= function(event) { console.log("getStoreObject Transaction Complete."); };
			trans.onerror 	= function(event) {	console.log("getStoreObject Transaction Error: ", event); };
		
			//Only ever one value in the DB
			var store = trans.objectStore(PNDB.Settings.dbObjectStore)
			var request = 	store.get(1);
			request.onerror = function(event) { console.log("addToken Error getting key[1]."); };
			request.onsuccess = function(event) {
				if(request.result){
		    		var data = request.result;
		    	
		    		data.token = token;
		    		var requestUpdate = store.put(data, 1);
		    		requestUpdate.onerror   = function(event) { console.log("addToken failed update."); };
		    		requestUpdate.onsuccess = function(event) { console.log("addToken successfully updated.");};
		    		
		    		//If the current is diff to new then we call for an update.		    		
		    		if(request.result.token != token)
		    			return request.result.token;
				}
				else
				{
					//Nothing to do here
					return null;
				}	
			};
		};		
	}
	
	return null;
};



function status(response) {  
	if (response.status >= 200 && response.status < 300) 
		return Promise.resolve(response);
	else  
		return Promise.reject(new Error(response.statusText)); 
}

function json(response) {  
	return response.json();  
}

	
// Listen to `push` notification event. Define the text to be displayed
// and show the notification.
self.addEventListener('push', function(event) {
//	console.log('SW Push received:', event);
	
	event.waitUntil(
		self.registration.pushManager.getSubscription().then(function(subscription) {
		
			//console.log(self.registration.pushManager.getSubscription());
			//console.log(subscription);
			
			var token = subscription.endpoint.split("/").slice(-1)[0];
			
//			console.log("Service Worker - token: ", token);
			
			//We use fetch because JQuery is out of scope in the SW
			//Note: when Chrome starts sending payload we will no longer need this.
			return fetch('/ajax/notifications/push/get_event', {  
						method: 'post', 
						headers: {  
						      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
						    	}, 
						body: 'token='+token  
		  			})  
				  .then(status)  
				  .then(json)  
				  .then(function(data) {  
					  /*Note: this status is from our code, different to the response status*/
					  if(data.status == 1 && data.data.hasOwnProperty('title'))
					  {
						 
						  console.log('Event request success: ', data.data); 
						  
						  var title = data.data.title;
						  var notificationOptions = {
									 body: data.data.body,
									 icon: data.data.icon,
									 tag: data.data.tag,
									 data: {url:data.data.url}};
						  
						  return self.registration.showNotification(title, notificationOptions);
					  }
					  else
					  {
						  console.error('Failed to find data for notification token: ', token);
					  }
					  
					 
				    //If Status = 0 then we exit out with nothing to show.
				  }).catch(function(error) {  
				    console.log('Event request failed: ', error);
 
				  });
		
		})
	);
	
	/* EXAMPLE DATA
	  	 title: 'xxXpanded Logon Alert.';	  
		 body: 'Your favourite host has come online.',
		 icon: '/assets/images/sitesetup/icon-192x192.png',
		 tag: 'xxxpanded-login-alert',
		 data: {url:'/user/credits'}}
	 */
	
		  
  
});


self.addEventListener('notificationclick', function(event) {  
	  console.log('Notification click: ', event.notification.tag);  
	  // Android doesn't close the notification when you click on it  
	  // See: http://crbug.com/463146  
	  event.notification.close();

	  var url = event.notification.data.url;
	  // This looks to see if the current is already open and  
	  // focuses if it is  
	  event.waitUntil( clients.matchAll({ type: "window" }).then(function(clientList) {  
	      for (var i = 0; i < clientList.length; i++) {  
	    	  var client = clientList[i];  
	    	  if (client.url == url && 'focus' in client)  
	    		  return client.focus();  
	      }  
	      if (clients.openWindow) {
	    	  return clients.openWindow(url);  
	      }
	  }));
});

// Listen to  `pushsubscriptionchange` event which is fired when
// subscription expires. Subscribe again and register the new subscription
// in the server by sending a POST request with endpoint. Real world
// application would probably use also user identification.
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Subscription expired');
  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true })
    .then(function(subscription) {
    	
    	var token = subscription.endpoint.split("/").slice(-1)[0];
    	var oldEndPoint = PNDB.addToken(token);
    	
    	if(oldToken == null || oldToken == token)
    		return;
      
    	return fetch('/ajax/notifications/push/subscription_controller', {  
			method: 'post', 
			headers: {  
			      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
			    	}, 
			body: 'token='+token+'&oldToken='+oldToken  
			})  
			  .then(status)  
			  .then(json)  
			  .then(function(data) {  
				  /*Note: this status is from our code, different to the response status*/
				  if(data.status == 1)
				  {					 
					  console.log('Resubscribe success: ', data.data); 
				  }
				  else
				  {
					  console.error('resubscribing failed. New token: ', token);
				  }
				  
				 
			    //If Status = 0 then we exit out with nothing to show.
			  }).catch(function(error) {  
			    console.log('resubscribe request failed on server request: ', error);
		
			  });
     
    }, function(error){ console.error('Error4: ', error);})
  );
});