importScripts('/project_data/firebase-config.js');
importScripts('/project_data/vars.js');
importScripts('/js/firebase/firebase-app.js');
importScripts('/js/firebase/firebase-messaging.js');
importScripts('/js/sw/analytics.js');

self.analytics.trackingId = trackingId;

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload['title'];
  const notificationOptions = {
    body: payload['body'],
    image: payload['image'],
    icon: payload['icon']
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('push', function(event) {
  console.log('%c%s', 'color: green; font-weight:700;', "push", event);

  const data = event.data.json();

  console.log( "push::PushMessageData: ", event.data.text() );

  let url = 'url unknown';
  let articleId = 'article_id_unknown';
  let projectName = idsite;
  if (data.hasOwnProperty('notification') && data.notification.hasOwnProperty('click_action')) {
    url = data.notification.click_action;
    let match = url.match(/(\d{6,})/g);
    if (match && match[1]) {
      articleId = match[1];
    }
  }
  event.waitUntil(
    self.analytics.trackEvent('Pushes showed', url)
  );
  fetch(`https://a.sputniknews.com/ping?idsite=${projectName}&url=${url}&_id=&_idts=&localtime=&h_id=&r=&events[0][ectgry]=webpush&events[0][srcaid]=${articleId}&events[0][etype]=show`);
});
