
				importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
				importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
				
				var config = {
					apiKey           : 'AAAAkbURWDU:APA91bGCqlgb0ar1UjJVDKOpvh7A-fAXVCamDPAYkdnzXgm7o6BBKcLjDPJBHO4b5TVcfy70Q-5yFy1skqKL9ATWkhScLzacIEr7RiMSloXkeWR9FP6k3Iq_F4s6LhuIyDuVrdPNy6AuiFifmU-qY8NMX6MycjMR1Q',
					authDomain       : 'pushwebdarmar.firebaseapp.com',
					messagingSenderId: '625808070709'
				};
				
				firebase.initializeApp(config);
				
				const messaging = firebase.messaging();
			