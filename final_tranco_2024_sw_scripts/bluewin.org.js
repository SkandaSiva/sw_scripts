/* eslint-disable */
let config = {
  'app': {
    'client': {
      'defaultUrl': 'https://www.bluewin.ch',
      'autosubscribe': false,
    },
    'api': {
      'id': '218',
      'platformId': '7',
      'baseUrl': 'https://swisscom.push.delivery/push-api/',
      'accessToken': '1c838b64db4b99e2bc44fe2d40d7cbad'
    },
    'firebase': {
      'projectId': 'nifty-formula-769',
      'apiKey': 'AIzaSyBOsUJ266m0ch0SyQghsPxAXjG5AHU36WM',
      'appId': '1:1073932710355:web:ef2bcc8d481ffe3baabf26',
      'messageSenderId': '1073932710355',
      'serviceWorkerPath': 'https://cdn-swisscom.push.delivery/bluewin/3.1.2/service-worker-production.js',
    },
    'database': {
      'notificationDB': 'ethinking-notification',
      'notificationTable': 'notification',
      'version': 1,
      'notificationMaxResults': 50
    },
  },
  'ui': {
    'template': {
      'modal': {
        'logo': 'https://cdn-swisscom.push.delivery/bluewin/images/bluenews-logo.png'
      }
    }
  },
};
importScripts('https://cdn-swisscom.push.delivery/bluewin/3.1.2/service-worker-production.js');
