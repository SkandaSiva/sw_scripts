importScripts('/themes/custom/ultrasawt/js/push/prod/ultrasawtpush.js');
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload,notification, data) {
console.log(payload, " ==== ",notification, data);


});

