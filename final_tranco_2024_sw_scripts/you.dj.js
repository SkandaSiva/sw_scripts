
// YOUDJ SERVICE WORKER

// -- OFFLINE FIRST -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var cache_name = "youdj_cache_4730";
var cached_urls = ['./jquery3.js','./jquery4.wasm'];
var cache_samples = ["0_Silence.mp3","#0_Lets_Gooo.mp3","#0_In_The_Mix.mp3","0_Ah_Yeah!.mp3","#0_Are_You_Ready.mp3","0_Check_this_Out_1.mp3","0_Check_this_Out_2.mp3","0_Can_You_Feel.mp3","0_Dream.mp3","0_Go!.mp3","0_Heh_Heh.mp3","0_Here_we_go.mp3","0_Hey_DJ.mp3","0_Im_your_DJ_1.mp3","0_Im_your_DJ_2.mp3","0_Im_your_DJ_3.mp3","0_I_Know.mp3","0_Latino_DJ.mp3","#0_Oh_My_God.mp3","0_One_Two_Three.mp3","0_Pump_Up_The_Volume.mp3","0_Put_Your_Hands_Up.mp3","#2_Horn.mp3","#2_Siren.mp3","#3_Scratch_1.mp3","3_Scratch_2.mp3","3_Scratch_3.mp3","3_Scratch_4.mp3","3_Scratch_5.mp3","3_Scratch_6.mp3","#4_Kick_1.mp3","4_Kick_2.mp3","4_Clap.mp3","4_Snare.mp3","4_HiHat_1.mp3","4_HiHat_2.mp3","5_Fun_Aigh!.mp3","5_Fun_Augh!.mp3","5_Fun_Crash.mp3","5_Fun_Dog.mp3","5_Fun_Donkey.mp3","5_Fun_Drums_Roll.mp3","#5_Fun_Scary_Laugh_1.mp3","5_Fun_Scary_Laugh_2.mp3","5_Fun_Scary_Laugh_3.mp3","5_Fun_Explosion.mp3","5_Fun_Fart.mp3","5_Fun_Glass_Crash.mp3","5_Fun_Hydraulic.mp3","5_Fun_Moto_Crash.mp3","5_Fun_Ohhhh.mp3","5_Fun_Phone.mp3","#5_Fun_Pikachu.mp3","5_Fun_Rock.mp3","5_Fun_Scream.mp3","5_Fun_Thunder.mp3","5_Fun_Whip.mp3","#8_Intro_Count_1.mp3","8_Intro_Count_2.mp3","8_Intro_Dancefloor.mp3","8_Intro_Dramatic.mp3","8_Intro_Movie.mp3","8_Intro_Rise_Up.mp3","8_Intro_Takeoff.mp3","8_Intro_Thx.mp3","8_Intro_Trip.mp3","#9_Transition_1.mp3","9_Transition_2.mp3","9_Transition_3.mp3","9_Transition_4.mp3","9_Transition_5.mp3","#A_Live_In_The_Mix.mp3","A_This_Is_Your_DJ.mp3","A_Ayo.mp3","A_Bam!.mp3","A_Beat_The_Technic.mp3","A_Can_you_go.mp3","A_Dont_Stop.mp3","A_Fresh!.mp3","#A_Here_We_Go_Again.mp3","A_Heyyy.mp3","A_Oh_My_God_2.mp3","A_Stadium_Applause.mp3","A_Unbelievable.mp3","A_Upcoming_Drop.mp3"];
var cache_sampler_todo = true;

function isMustCache(_url) { return _url.indexOf("https://youdj.online/") >= 0 && !/download|desktop|nextbeat|playbeta|beatport|artist|embed|demo|youtube|.mp4|store|hosting|server|km/g.test(_url); }

function cache_sampler()
{
	console.log('[Service Worker] cache all sampler!');
	cache_sampler_todo = false;
	var samples_files = []; cache_samples.forEach(sample => samples_files.push("./sampler/"+sample.replace("#","")));
	caches.open(cache_name).then(cache => cache.addAll(samples_files));
}

self.addEventListener('install', function(event)
{
	console.log('[Service Worker] install > prefill', cache_name);
	event.waitUntil(caches.open(cache_name).then(cache => cache.addAll(cached_urls)));
});

self.addEventListener('activate', function(event)
{
	console.log('[Service Worker] activate > clean old cache');
	event.waitUntil(caches.keys().then(cacheNames => Promise.all(cacheNames.map(function(cacheName) {
		console.log('[Service Worker] activate > list cache '+cacheName, cache_name != cacheName ? "delete!" : "keep");
		if(cache_name != cacheName) return caches.delete(cacheName);
	}))));
});

self.addEventListener('fetch', function(event)
{
	//return; // don't intercept (normal browsing)
	if(!isMustCache(event.request.url)) return;
	event.respondWith(caches.open(cache_name).then(function(cache) {
		return cache.match(event.request).then(function (response) {
			//console.log('[Service Worker] Fetch ', event.request.url, ' > ', response ? 'from '+cache_name : 'from network');
			return response || fetch(event.request).then(function(response) {
				if(cache_sampler_todo && event.request.url.indexOf("sampler/") > 0) cache_sampler();
				if(response.status == 200 && isMustCache(event.request.url)) cache.put(event.request, response.clone());
				return response;
			});
		});
	}).catch(function (error) {
		console.log('[Service Worker] Fetch ', event.request.url, ' > error = ', error);
		//return new Response("Not found "+event.request.url);
	}));
});


// -- HTML5 NOTIFICATION -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

self.addEventListener('push', function (event)
{
	console.log('Service Worker] Push had this data:', event.data.text());
	const title = 'YOU.DJ UPDATE !';
	const options = {body: event.data.text(), icon: 'https://you.dj/picx/notif_icon.png'};
	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event)
{
	console.log('[Service Worker] Notification click Received.');
	event.notification.close();
	event.waitUntil(clients.openWindow('https://you.dj?newfirst'));
});
