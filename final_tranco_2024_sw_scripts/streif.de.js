/*
	2023-11-17

	www.streif.de

	v2
*/

const sw_version = 'v2_0_0';


//1) Clients in Richtung service worker
const c4d_bc_channel_worker = new BroadcastChannel('c4d_bc_channel_worker');

//2) Service worker zu allen kontrollierten clients.
const c4d_bc_channel_clients = new BroadcastChannel('c4d_bc_channel_clients');



self.addEventListener('install', (evt)=>{
	evt.waitUntil(
		(async ()=>{
console.log(`SW install: ${sw_version}`);
		})()
	);

	self.skipWaiting();
});





self.addEventListener('activate', (evt)=>{
	evt.waitUntil(
		(async ()=>{
console.log(`SW activate: ${sw_version}`);
		})()
	);

	//Dieser worker übernimmt sofort die Kontrolle über alle clients zu dieser Site
	self.clients.claim();
});




/*
self.addEventListener('fetch', (evt)=>{
});
*/

