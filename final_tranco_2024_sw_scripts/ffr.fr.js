importScripts("https://via.batch.com/v2/worker.min.js"); // eslint-disable-line no-undef

const eventsList = ["pushsubscriptionchange", "install", "push", "notificationclick", "message"];
eventsList.forEach(eventName => {
  self.addEventListener(eventName, event => {
    event.waitUntil(self.handleBatchSDKEvent(eventName, event));
  });
});
