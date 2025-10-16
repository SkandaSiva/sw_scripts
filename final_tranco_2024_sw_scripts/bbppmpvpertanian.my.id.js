self.addEventListener("install", e => {
	e.waitUntil(
		caches.open("static").then(cache => {
			return cache.addAll(["./", "./css/responsee.css", "./css/icons.css", "./js/jquery-1.8.3.min.js", "./js/jquery-ui.min.js", "./owl-carousel/owl.carousel.js","./img/background.jpg", "./img/330x190-2.jpg", "./img/alur.png", "./img/wbk.png"]);
		})
	);
});


self.addEventListener("fetch", e => {
	console.log('For : ${e.request.url}');
});

