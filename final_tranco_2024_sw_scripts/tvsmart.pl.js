/* eslint-disable */

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts(
	'https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js'
);

firebase.initializeApp({
	apiKey: 'AIzaSyByZZdLclw6Vdbd9WColZNczJdb-8pxols',
	authDomain: 'tvonline-vectra.firebaseapp.com',
	databaseURL: 'https://tvonline-vectra.firebaseio.com',
	projectId: 'tvonline-vectra',
	storageBucket: 'tvonline-vectra.appspot.com',
	messagingSenderId: '139625602098',
	appId: '1:139625602098:web:dab05fb88c4ef6df87702b',
	measurementId: 'G-G2V56NY9S6'
});

firebase.messaging();
