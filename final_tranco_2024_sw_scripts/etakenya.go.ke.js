
      importScripts(
          'https://www.gstatic.com/firebasejs/9.3.0/firebase-app-compat.js'
      );
      importScripts(
          'https://www.gstatic.com/firebasejs/9.3.0/firebase-messaging-compat.js'
      );
      firebase.initializeApp({
          apiKey: 'AIzaSyDDKJWPO4ltjEVNQ93RL7u9FrRt-yVvKeo',
          authDomain: 'travizory-vmp-ken.firebaseapp.com',
          databaseURL: 'https://travizory-vmp-ken-app.europe-west1.firebasedatabase.app',
          projectId: 'travizory-vmp-ken',
          storageBucket: 'travizory-vmp-ken.appspot.com',
          messagingSenderId: '294946687689',
          appId: '1:294946687689:web:ab1e05e6f87f304bdb5b18',
          measurementId: 'G-5H0L6MBXCN',
          vapidKey: 'BHkayEisLpExw8JYuRzo4zYL-ZsJD_j6c-XHJp_QE0nd-95UssTvtbs5lZ3ZuieIp9d4TBNfVekDrZjv9-eSgZw',
      });
      const message = firebase.messaging();

      message.onBackgroundMessage((payload) => {});

    