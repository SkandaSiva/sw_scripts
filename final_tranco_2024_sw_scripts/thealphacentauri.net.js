const CACHE_VERSION = 'v0.20233112';
const CACHE_NAME = `thealphacentauri-${CACHE_VERSION}`;

self.addEventListener('install', event => {
    console.log("Service worker installed!");
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                '/favicon.ico',
                '/favicon-128.png',
                '/wp-content/themes/theac2/style.css',
                '/wp-content/themes/theac2/bright.css',
            ]);
        })
    );
});

// Cache clean-up
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log(`Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes('/wp-content/')) {
        // Cache-first strategy for static assets
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    } else {
        // Network-first strategy for dynamic content
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            })
        );
    }
});

self.addEventListener('pushsubscriptionchange', function(event) {
  event.waitUntil(
    fetch('https://server.thealphacentauri.net/pushsubscriptionchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        old_sub: event.oldSubscription,
        new_sub: event.newSubscription
      })
    })
  );
});

self.addEventListener('push', e => {
	console.log("push message received");
    const data = e.data.json();
	const body = JSON.parse(data.body);
	const options = { tag : body.id };	
	if(data.title == "cancel"){
		self.registration.getNotifications(options).then((notifications) => {
		const notification = notifications.find(notification => notification.tag === body.id)
		if (notification) {
			notification.close()
		}
		})	
	}
	else {
var text = ["",""];
		if(body.message == "uk"){
			if(data.title == 1)
				text = ["Новий коментар!","Ваш допис прокоментували"];
			else if(data.title == 2)
				text = ["Новий коментар!","На ваш коментар відповіли"];
			else if(data.title == 15)
				text = ["Новий коментар!","Публікації, на яку ви підписані"];
			else if(data.title == 10)
				text = ["Вас відмітили","В коментарях під дописом"];
			else if(data.title == 3)
				text = ["Ваш коментар оцінили","На жаль, негативно :("];
			else if(data.title == 5)
				text = ["Ваш коментар оцінили","Позитивна оцінка!"];
			else if(data.title == 9)
				text = ["В вашому пості одруківка","Будь ласка, перевірте!"];
			else if(data.title == 8)
				text = ["Ваш допис розпубліковано","За рішенням адміністрації"];
			else if(data.title == 0)
				text = ["Системне повідомлення","Від адміністрації"];
			else if(data.title == 23)
				text = ["Вас було заблоковано :(","Це рішення адміністрації"];
			body.message = text[1];
			data.title = text[0];
		}
		else if(body.message == "ru_RU"){
			if(data.title == 1)
				text = ["Новый комментарий!","Вашу запись прокомментировали"];
			else if(data.title == 2)
				text = ["Новый комментарий!","Появился ответ на ваш комментарий"];
			else if(data.title == 15)
				text = ["Новый комментарий!","Публикации, на которую вы подписаны"];
			else if(data.title == 10)
				text = ["Вас отметили","В комментариях под постом"];
			else if(data.title == 3)
				text = ["Ваш комментарий оценили","Увы, негативно :("];
			else if(data.title == 5)
				text = ["Ваш комментарий оценили","Положительная оценка!"];
			else if(data.title == 9)
				text = ["В вашем посте опечатка","Проверьте, пожалуйста!"];
			else if(data.title == 8)
				text = ["Ваш пост был распубликован","По решению администрации"];
			else if(data.title == 0)
				text = ["Системное сообщение","От администрации"];
			else if(data.title == 23)
				text = ["Вы были заблокированы :(","Это решение администрации"];
			body.message = text[1];
			data.title = text[0];
		}
		else if(body.message == "en_US"){
			if(data.title == 1)
				text = ["Новий коментар!","Ваш допис прокоментували"];
			else if(data.title == 2)
				text = ["Новий коментар!","На ваш коментар відповіли"];
			else if(data.title == 15)
				text = ["Новий коментар!","Публікації, на яку ви підписані"];
			else if(data.title == 10)
				text = ["Вас відмітили","В коментарях під дописом"];
			else if(data.title == 3)
				text = ["Ваш коментар оцінили","На жаль, негативно :("];
			else if(data.title == 5)
				text = ["Ваш коментар оцінили","Позитивна оцінка!"];
			else if(data.title == 9)
				text = ["В вашому пості одруківка","Будь ласка, перевірте!"];
			else if(data.title == 8)
				text = ["Ваш допис розпубліковано","За рішенням адміністрації"];
			else if(data.title == 0)
				text = ["Системне повідомлення","Від адміністрації"];
			else if(data.title == 23)
				text = ["Вас було заблоковано :(","Це рішення адміністрації"];
			body.message = text[1];
			data.title = text[0];
		}
		else if(data.title == 55){
			
		}

	self.registration.showNotification(data.title, {
		  body: body.message,
		  tag: body.id,
		  icon: 'https://thealphacentauri.net/favicon.ico',
		  vibrate: [200,100,200],
		  image: data.image,
		  data: { url:body.url },
	});
	}
});

self.addEventListener('notificationclick', (event) => {
  console.log({ notificationclick: event })
  if (event.notification.data.url) {
    clients.openWindow(event.notification.data.url)
  } else {
    // Open tv page
    clients.openWindow(origin + '/notifications/')
  }
  event.notification.close()
})