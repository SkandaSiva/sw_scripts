// Должно быть true в production

const doCache = false, CACHE_NAME = 'pwa-cache-3d-v1';
const bigCardsRegExp = typeof(Response.redirect)=="function" ? new RegExp('https?://((?:[a-z0-9]+\\.)?3d-galleru.ru)(/cards/.+\\.(?:gif|mp4))') : new RegExp('^/fake_url/');
const allCardsRegExp = typeof(Response.redirect)=="function" ? new RegExp('https?://((?:[a-z0-9]+\\.)?3d-galleru.ru)(/cards/.+\\.(?:gif|mp4|jpg|png))') : new RegExp('^/fake_url/');

const servers = {
	content_type: ["video", "image"],
	test_time: 0,
	check_interval: 1*60*1000,
	random: Math.random(),
	total_traffic: 0,
	traffic: {},
	bg_traffic: {},
	units: {
		"m1.3d-galleru.ru": 1000
	},
	DDS: {
		"m1.3d-galleru.ru": 1000
	},
	time: {},
	fetch: function(domain){
		
		const timeout = setTimeout(servers.setStatus, 5000, domain, {speed: 0, bg_traffic: 0});
		
		fetch('https://' + domain + '/test-speed/', {method: "GET", cache: "reload"}).then(function(response){			
			if(!response.ok) throw new Error(`${domain} HTTP error! status: ${response.status}`);			
			return response.json();
		}).then(function(json){
			if(json.speed==0 && json.bg_traffic==0) json.speed+=0.01;
			if(!json.bg_traffic) json.bg_traffic = 0;
			servers.setStatus(domain, json);
			clearTimeout(timeout);
			console.log(domain + ' -> ' + json.speed + ' '+json.bg_traffic+'%');
		}).catch(function(error){
			console.error(domain + ' origin error', error);
			servers.setStatus(domain, {speed: 0, bg_traffic: 0});
		});
	},
	setStatus: function(domain, json){
		servers.traffic[domain] = json.speed;
		servers.bg_traffic[domain] = json.bg_traffic;
		servers.total_traffic = Object.values(servers.traffic).reduce(function(sum, elem){return sum + elem}, 0);
	},
	setTime: function(domain, time){		
		servers.time[domain] = time;		
		//setTimeout(servers.insertIntoDB, 3000, domain, time);
	},
	insertIntoDB: function(domain, time){
		
		var music = servers.db.transaction(["domains"], "readwrite").objectStore("domains"), request = music.put({domain: domain, time: time, info: new Date().toUTCString()});
	},
	checkSpeed: function(){
		
		this.test_time = new Date().getTime();
		
		for(let domain in this.units){
			this.fetch(domain);
		}
		
		this.random = Math.random();
		
		setTimeout(function(){console.log('total traffic: ' + Math.round(servers.total_traffic));}, 7000);
	},
	is_IOS: function(){
		return !!navigator.platform && /iPad|iPhone|iPod|MacIntel|MacPPC|Macintosh/.test(navigator.platform);
	},
	unit: function(){
		
		if(servers.is_IOS() && false){
			
			servers.use_main = true;
			
			//bigCardsRegExp = typeof(Response.redirect)=="function" ? new RegExp('https?://((?:[a-z0-9]+\\.)?3d-galleru.ru)(/cards/.+\\.(?:gif|mp4|png|jpg))') : new RegExp('^/fake_url/');
		}
		else{
			servers.use_main = false;
		}
		
		/*
		var request = indexedDB.open("ServiceWorker", 1);

		request.addEventListener("error", function(event) {
			console.log("Database error: " + event.target.errorCode);
		});

		request.addEventListener("success", function(event) {
			servers.db = event.target.result;
			
			var music = servers.db.transaction(["domains"], "readwrite").objectStore("domains");
			
			music.openCursor().addEventListener("success", function(event) {
				var cursor = event.target.result;
				if(cursor){
					if(servers.units.indexOf(cursor.value.domain)!=-1){
						if(!servers.time[cursor.value.domain]){
							servers.time[cursor.value.domain] = cursor.value.time;						
						}
					}
					else{
						cursor.delete();
					}
					
					cursor.continue();
				}
			});
		});

		request.addEventListener("upgradeneeded", function(event) {
			servers.db = event.target.result;
			
			var objectStore = servers.db.createObjectStore("domains", {
				keyPath: "domain"
			});
		});
		
		*/
		
		indexedDB.deleteDatabase("ServiceWorker");
	}
};

// Очищает старый кэш

self.addEventListener('activate', event => {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys()
		.then(keyList =>
			Promise.all(keyList.map(key => {
				if (!cacheWhitelist.includes(key)) {
					console.log('Deleting cache: ' + key)
					return caches.delete(key);
				}
			}))
		)
	);
		
	if(new Date().getTime() - servers.test_time > servers.check_interval){
		servers.checkSpeed();
	}
});

//'install' вызывается, как только пользователь впервые открывает PWA

self.addEventListener('install', function(event){
	
	self.skipWaiting();
	
	if(doCache) {
		event.waitUntil(
			caches.open(CACHE_NAME)
			.then(function(cache) {
				// Получаем данные из манифеста (они кэшируются)
				fetch('/android_app/manifest.json')
					.then(response => {
						response.json()
					})
					.then(assets => {
						// Открываем и кэшируем нужные страницы и файлы
						const urlsToCache = [
							'/app/',
							'/static/core/logo.svg*',
						]
						cache.addAll(urlsToCache)
						console.log('cached');
					})
			})
		);
	}
});

// Когда приложение запущено, сервис-воркер перехватывает запросы и отвечает на них данными из кэша, если они есть

self.addEventListener('fetch', function(event){
	
	/*
	if(doCache) {
		event.respondWith(
			caches.match(event.request).then(function(response) {
				return response || fetch(event.request);
			})
		);
	}
	*/
	
	let m;
	
	if(servers.use_main){
		
		let good_ssl = 'm1.3d-galleru.ru';
		
		if(servers.content_type.indexOf(event.request.destination)>-1 && (m = event.request.url.match(bigCardsRegExp)) && !/sw=sw$/.test(event.request.url) && servers.traffic[good_ssl]>0){
		
			event.respondWith(Response.redirect('https://' + good_ssl + m[2] + '?sw=sw', 301));
		}
	}
	else if(servers.content_type.indexOf(event.request.destination)>-1 && (m = event.request.url.match(bigCardsRegExp)) && !/sw=sw$/.test(event.request.url)){
		
		let rnd = servers.random, tsum = 0, selected = false, current_domain = m[1];
		
		let total_max = 0;
		
		for(let domain in servers.units){
			
			let t = servers.traffic[domain] || 0;
			
			if(t>0){
				total_max += servers.units[domain] - t*servers.bg_traffic[domain]/100;
			}
		}
		
		for(let domain in servers.units){
			
			let t = servers.traffic[domain] || 0;
			
			if(t>0){
			
				tsum += servers.units[domain] - t*servers.bg_traffic[domain]/100;
				
				if(t<servers.units[domain] && tsum/total_max>rnd){
					
					event.respondWith(Response.redirect('https://' + domain + m[2] + '?sw=sw', 301));
					
					selected = true;
					
					//console.log(`${domain} selected`);
					
					break;
				}
			}
		}
	}
	else if(servers.content_type.indexOf(event.request.destination)>-1 && (m = event.request.url.match(allCardsRegExp)) && !/sw=sw$/.test(event.request.url)){
		
		let rnd = servers.random, tsum = 0, selected = false, current_domain = m[1];
		
		let total_max = 0;
		
		for(let domain in servers.DDS){
			
			let t = servers.traffic[domain] || 0;
			
			if(t>0){
				total_max += servers.DDS[domain] - t*servers.bg_traffic[domain]/100;
			}
		}
		
		for(let domain in servers.DDS){
			
			let t = servers.traffic[domain] || 0;
			
			if(t>0){
			
				tsum += servers.DDS[domain] - t*servers.bg_traffic[domain]/100;
				
				if(t<servers.DDS[domain] && tsum/total_max>rnd){
					
					event.respondWith(Response.redirect('https://' + domain + m[2] + '?sw=sw', 301));
					
					selected = true;
					
					//console.log(`${domain} selected`);
					
					break;
				}
			}
		}
	}
	
	if(new Date().getTime() - servers.test_time > servers.check_interval) servers.checkSpeed();
});

servers.unit();