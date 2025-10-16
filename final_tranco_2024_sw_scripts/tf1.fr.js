function setupSharedBatchSDK() {
  importScripts('https://via.batch.com/v3/worker.min.js');

  const eventsList = ['pushsubscriptionchange', 'push', 'notificationclick', 'message', 'install'];
  eventsList.forEach(eventName => {
    self.addEventListener(eventName, event => {
      event.waitUntil(self.handleBatchSDKEvent(eventName, event));
    });
  });
}

setupSharedBatchSDK();
