importScripts(
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyAx8_ZIUY68vu1X3S00ywcasgbkuW9ATUU',
  authDomain: 'siyavula-5330c.firebaseapp.com',
  projectId: 'siyavula-5330c',
  storageBucket: 'siyavula-5330c.appspot.com',
  messagingSenderId: '869504462768',
  appId: '1:869504462768:web:f62574a4a6e07cd81f3075'
});

const messaging = firebase.messaging();
