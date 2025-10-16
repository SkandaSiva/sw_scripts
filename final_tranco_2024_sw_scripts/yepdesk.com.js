
// Version 0.1

//'use strict';


function addLoginHistory(userId){
	 // console.log("adding last login "+userId); 	
	  var db;
	  var dbOpenReq = indexedDB.open( 'localDB', 1 );
	  
	  dbOpenReq.onupgradeneeded = function(e) {
		  //console.log("inside on onupgradeneeded");
	      db = e.target.result;
	  
	      e.target.transaction.onerror = dbOpenReq.onerror;
	  
	      var objectStore = db.createObjectStore("loginHistory",
				        {keyPath: "key"});
				      
	      objectStore.transaction.oncomplete = function(event) {
			    // Store values in the newly created objectStore.
	    	  	//console.log("adding last login "+userId);
			    var objectStore = db.transaction("loginHistory", "readwrite").objectStore("loginHistory");
			    objectStore.put({
			        "key": "lastLoginUserId",
			        "value": userId
			      });
		  };
	      
	    
	 };
	    
	 dbOpenReq.onerror = function(event) {
		 console.log("unexpected error");
	 };
	    
	 dbOpenReq.onsuccess = function(event) {
    	db = event.target.result;
    	//console.log("inside on success "+db);
   	  
    	var transaction = db.transaction(["loginHistory"],"readwrite");
				      
    	 var objectStore = transaction.objectStore("loginHistory");
		    objectStore.put({
		        "key": "lastLoginUserId",
		        "value": userId
		 });
    };

}

function clear(){
	  var db;
	  var dbOpenReq = indexedDB.open( 'localDB', 1 );
	  dbOpenReq.onsuccess = function(event) {
		db = event.target.result;
	    //console.log("opened db for clear: "+ db);
	    var transaction = db.transaction(["loginHistory"]);
	    var objectStore = transaction.objectStore("loginHistory","readwrite");
	    
	    transaction.oncomplete = function(event) {
	    	//console.log("transaction complete");
	    };
	    
	    transaction.onerror = function(event) {
	    	console.log("transaction error");
	    };
	    
	    var clearReq = objectStore.clear("lastLoginUserId");
	     
	    clearReq.onerror = function(event) {
	        console.log("Unable to clear loginHistory");
	    };
	     
	    clearReq.onsuccess = function(event) {
	    	//console.log("login history cleared");
	    };
	 };
	 
	 dbOpenReq.onerror = function(event) {
	     console.log("Unable to open database!");
	 };
}

function fetchData(notificationEndPoint){
	 fetch(notificationEndPoint).then(function(response) {
    	 if (response.status !== 200) {
    	        //console.log('Looks like there was a problem. Status Code: ' +response.status);
    	        throw new Error();
    	 }
    	 
    	// Examine the text in the response
         return response.json().then(function(data) {
        	 console.log('inside data'+data.eventCount);
        	 if(data.eventCount != 0){
	        	 var title = 'New events created in YepDesk !';
	        	 var message = null;
	        	 if(data.eventCount != 1){
	        		 message = 'You have '+data.eventCount+' new events today.';
	        	 }else{
	        		 message = 'You have a new event today.';
	        	 }
	            
	             var icon = '/assets/images/logo.jpg';
	             var notificationTag = 'chat-message';
	             return showNotification(title, message, icon);
        	 }else{
        		 return;
        	 }
            
         });
     }).catch(function(err) {
         //console.error('Unable to retrieve data', err);
         //updateNotificationStatus("FAILED");
         var title = 'New notification for you';
         var message = 'Click to view more details';

         return showNotification(title, message);
         
       })
}

/**
 * 
 * @returns
 */
function fetchNotifications(){
	  var db;
	  var request = indexedDB.open( 'localDB', 1 );
	  request.onsuccess = function(event) {
		db = event.target.result;
	    //console.log("success in fetch: "+ db);
	    var transaction = db.transaction(["loginHistory"]);
	    var objectStore = transaction.objectStore("loginHistory");
	    var request = objectStore.get("lastLoginUserId");
	     
	     request.onerror = function(event) {
	        //console.log("Unable to retrieve daa from database!");
	     };
	     
	     request.onsuccess = function(event) {
	        if(event.target.result) {
	        	 //console.log("Id: " + event.target.result.value);
	        	 var userId = event.target.result.value;
	        	 var notificationEndPoint = '/rest/v1/user/'+userId+'/notifications';
	        	 
	        	 //console.log("notification end point final "+notificationEndPoint);
	        	 
	        	 fetchData(notificationEndPoint);
	        	 
	        }else {
	        	 //console.log("No user data found in loginHistory");
	        }
	     };
	  };
}


//console.log('Registering service worker', self);
self.addEventListener('install', function(event) {
  self.skipWaiting();
  //console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
  //console.log('Activated', event);
});

function showNotification(title, body, icon, data) {
	console.log('inside showNotification');
	  var notificationOptions = {
	    body: body,
	    icon: icon ? icon : '/assets/images/logo.jpg',
	    tag: 'simple-push-demo-notification',
	    data: data
	  };

	  self.registration.showNotification(title, notificationOptions);
	  return;
}

self.addEventListener('push', function(pushEvent) {
  //console.log('Push message received', pushEvent);
  fetchNotifications();
  
});

self.addEventListener('message', function(event) {
	
	//console.log("Message received in sw "+event.data);
	
	//var data = JSON.parse(event.data);
	addLoginHistory(event.data.userId);
	/*if(data.command === "add"){
		console.log("inside add "+data.command);
		addLoginHistory(data.userId);
	}*/
	
});

self.addEventListener('notificationclick', function(event) {
	  //console.log('Notification click: tag', event.notification.tag);
	  event.notification.close();
	  var url = '/push-notifications';
	  // Check if there's already a tab open with this URL.
	  // If yes: focus on the tab.
	  // If no: open a tab with the URL.
	  event.waitUntil(
	    clients.matchAll({
	      type: 'window'
	    })
	    .then(function(windowClients) {
	      //console.log('WindowClients', windowClients);
	      for (var i = 0; i < windowClients.length; i++) {
	        var client = windowClients[i];
	        //console.log('WindowClient', client);
	        if (client.url === url && 'focus' in client) {
	          return client.focus();
	        }
	      }
	      if (clients.openWindow) {
	        return clients.openWindow(url);
	      }
	    })
	  );
	});
