try {
  importScripts('/service-worker.js?v=0118');
importScripts("https://assets.emarsys.net/web-emarsys-sdk/3.7.0/web-emarsys-service-worker.js")
} catch (error) {
  console.log('OneSignalSDKWorker.js error:', error);
}
