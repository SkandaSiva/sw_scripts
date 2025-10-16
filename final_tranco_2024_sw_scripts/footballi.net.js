// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.

importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-messaging.js');
importScripts('https://assets.footballi.app/desktop/assets/shared-application/scripts/analytics-helper.js')

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyBV_GAuIoGoKRgc9eErXNY8EdznYVzE3GI",
  authDomain: "spartan-figure-803.firebaseapp.com",
  databaseURL: "https://spartan-figure-803.firebaseio.com",
  projectId: "spartan-figure-803",
  storageBucket: "spartan-figure-803.appspot.com",
  messagingSenderId: "480698657459",
  appId: "1:480698657459:web:798d41e7de05a7e4a25ec6",
  measurementId: "G-4G838L95GQ"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();


messaging.setBackgroundMessageHandler(function (payload) {
  const push = parsePushData(payload);
  if (push) {
    const notificationOptions = {
      body: push.body,
      data: {link: push.link},
      badge: "assets/shared-application/images/favicons/notification-badge.png",
      icon: "assets/shared-application/images/favicons/apple-touch-icon.png",
      image: push.image,
      tag: push.tag
    };

    if (!notificationOptions.image) {
      delete notificationOptions.image;
    }
    if (!notificationOptions.tag) {
      delete notificationOptions.tag;
    } else {
      notificationOptions.renotify = true;
    }
    sendAnalyticsEvent('received', 'notification')
    return self.registration.showNotification(push.title, notificationOptions);
  }
});


self.addEventListener('notificationclick', function (event) {
  const urlToOpen = new URL(event.notification.data.link).href;

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let matchingClient = null;

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url === urlToOpen) {
        matchingClient = windowClient;
        break;
      }
    }

    if (matchingClient) {
      return matchingClient.focus();
    } else {
      return clients.openWindow(urlToOpen);
    }
  });
  event.notification.close();
  sendAnalyticsEvent('open', 'notification')
  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclose', function (event) {
  event.waitUntil(
    sendAnalyticsEvent('close', 'notification')
  );
});

function parsePushData(payload) {
  const website = 'https://footballi.net/';
  let title, body, image, link, push_type, tag;
  const push_type_list = {
    'GENERAL': 0,
    'MATCH': 1,
    'UPDATE': 4,
    'NEWS': 6,
    'NEWS_MENTION': 7,
    'NEWS_WITH_IMAGE': 8,
    'MATCH_LINEUP': 9,
    'MATCH_VIDEO': 29,
    'MATCH_PREDICTION': 12,
    'MATCH_START': 13,
    'MATCH_HALF_END': 14,
    'MATCH_HALF_START': 15,
    'MATCH_END': 16,
    'MATCH_RED_CARD': 17,
    'MATCH_HOME_GOAL': 18,
    'MATCH_AWAY_GOAL': 19,
    'PREDICTION_CHALLENGE': 20,
    'QUIZ_ROYALE': 26,
    'COMMENT': 27,
    'POLL': 32
  };

  if (payload.data.json) {
    const pushData = JSON.parse(payload.data.json);
    if (pushData && ((pushData.NEW_TYPE >= 1 && pushData.NEW_TYPE <= 19) || pushData.NEW_TYPE === 29
      || pushData.NEW_TYPE === 32)) {
      // set default link value:
      link = website;
      title = pushData.TITLE;

      if (pushData.DESCRIPTION) {
        body = pushData.DESCRIPTION;
      }

      if (pushData.NEW_TYPE === push_type_list.NEWS ||
        pushData.NEW_TYPE === push_type_list.NEWS_MENTION ||
        pushData.NEW_TYPE === push_type_list.NEWS_WITH_IMAGE) {
        // News type:
        push_type = 'news';
        link = website + 'news/r/' + pushData.data.news_id + '/share';
        if (pushData.NEW_TYPE === push_type_list.NEWS_WITH_IMAGE) {
          push_type = 'news_with_image';
          image = pushData.data.news_image[0].url.replace('@s', '600');
        }
      } else if ((pushData.NEW_TYPE >= push_type_list.MATCH_LINEUP && pushData.NEW_TYPE <= push_type_list.MATCH_AWAY_GOAL) ||
        pushData.NEW_TYPE === push_type_list.MATCH_VIDEO ||
        pushData.NEW_TYPE === push_type_list.MATCH) {
        // Match type:
        tag = pushData.NOTIFICATION_ID;
        title = pushData.TITLE;
        body = pushData.DESCRIPTION;
        link = website + 'match/' + pushData.MATCH.match_id + '/share';
        push_type = 'match';
      } else if (pushData.NEW_TYPE === push_type_list.POLL) {
        push_type = 'poll';
        link = website + `news/poll/${pushData.POLL.id}`;
        if (pushData.POLL.cover) {
          image = pushData.POLL.cover.replace('@s', '600');
        }
      } else if (pushData.NEW_TYPE === push_type_list.UPDATE) {
        title = pushData.TITLE;
        body = pushData.DESCRIPTION;
        link = pushData.INTENT;
        push_type = 'update';
      }
      link += '?utm_source=push_notification&utm_medium=push&utm_campaign=' + 'push_' + push_type;
      return {
        title: title,
        image: image,
        body: body,
        link: link,
        tag: tag
      }
    }
  }
  return false;
}
