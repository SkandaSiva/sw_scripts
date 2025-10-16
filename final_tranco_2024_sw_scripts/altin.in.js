const versiyon = 'v1';
const cache_adi = `altin-${versiyon}`;


self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {

});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if ('focus' in client)
        return client.focus();
    }
    if (clients.openWindow) {
    	var url = event.notification.tag;
    	if(event.notification.data!=null) {url=event.notification.data};
      	return clients.openWindow(url);
    }
  }));
});

self.addEventListener('push', function(event) {
  var bildirim = 'https://altin.in/bildirimler.asp?id=';

  event.waitUntil(
    registration.pushManager.getSubscription()
    .then(function(kayit) {
      bildirim = bildirim + kayit.endpoint.split("/").slice(-1);

      return fetch(bildirim)
      .then(function(response) {
        if (response.status !== 200){
          console.log("Ulasim sorunu: "+response.status);
          throw new Error();
        }

        return response.json();
      })
      .then(function(data) {
       var mesajlar = [];
	      for(var i=0; data.notification && i < data.notification.length; i++) {
	        mesajlar.push(self.registration.showNotification(data.notification[i].title, {
	          body: data.notification[i].body,
	          icon: data.notification[i].icon,
	          tag: data.notification[i].tag,
	          data: data.notification[i].url,
	        }));
	      }
	return Promise.all(mesajlar);
      })
      .catch(function(err) {
        return self.registration.showNotification('Altin.in bildirim', {
          body: 'Yeni bildirimlerinizi okumak i�in t�klay�n',
          icon: 'https://altin.in/grafik/kare.png',
          tag: 'Altin.in Bildirim',
          data: 'https://altin.in/'
        });
      });
    })
  );
});