	// Bildirimi al ve göster
	self.addEventListener('push', (event) => 
	{
		let data = {};

		try 
		{
			// Gelen bildirimi JSON olarak al
			data = event.data.json();
			console.log('Push Bildirimi Alındı:', data);  // Burada datayı kontrol edin
 
		} 
		catch (error) 
		{
			console.error('Bildirim verisi alınamadı:', error);
		}

		const options = 
		{
			body: data.body || 'Bilinmeyen içerik',
			icon: data.icon || '/icon.png',  // İkon ekle (opsiyonel)
			image: data.image || null,       // Resim ekle (opsiyonel)
			data: 
			{
				url: data.url || '/',
				notificationId: data.notificationId
				
				
			}
		};
 
		// Bildirimi göster
		event.waitUntil(
			self.registration.showNotification(data.title || 'Başlık Yok', options)
		);

		 
	});

	// Kullanıcı bildirime tıkladığında
	self.addEventListener('notificationclick', (event) => 
	{
	  event.notification.close();  // Bildirimi kapat
	  
console.log('Notification Data:', event.notification.data);
	  const { url, notificationId } = event.notification.data;
	  console.log(event.notification.data);  // Burada veriyi kontrol edin

	  // Tıklama bilgilerini sunucuya gönder
	  fetch(`https://panel.lastnotify.com/notification-click?notificationId=${notificationId}`, {
		method: 'GET',
		mode: 'no-cors'
	  })
		.then(response => {
		  if (!response.ok) {
			throw new Error('Tıklama logu isteği başarısız.');
		  }
		  //console.log('Tıklama logu başarıyla gönderildi.');
		})
		.catch(err => console.error('Tıklama logu hatası:', err));

	  // Tıklama sonrası URL'yi aç
	  event.waitUntil(clients.openWindow(url));
	});
