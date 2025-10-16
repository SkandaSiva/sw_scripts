var version = '1.9.2';
importScripts('https://notifpush.com/serviceworker.js');

const eventsList = [
  'pushsubscriptionchange',
  'install',
  'push',
  'notificationclick',
  'message',
];
eventsList.forEach(eventName => {
  self.addEventListener(eventName, event => {
    event.waitUntil(self.handleBatchSDKEvent(eventName, event));
  });
});
