var TLG_SW_VERSION = '2022c';

importScripts('https://aswpsdkus.com/notify/v1/ua-sdk.min.js');
uaSetup.worker(self, {
  defaultIcon: 'https://www.telegraaf.nl/statics/icons/webpush.png',
  defaultTitle: 'De Telegraaf',
  defaultActionURL: 'https://www.telegraaf.nl',
  appKey: 'YfBKZe4QQo20aiKKT8StTA',
  token: 'MTpZZkJLWmU0UVFvMjBhaUtLVDhTdFRBOldJZm9JdVdQYUJuNFNSZTlaemZnN3hDRTF5MGlTMV9aN0d1T29VSFF3aFU',
  vapidPublicKey: 'BEXJlgBHWXk-ymqdSPSd2sO_VKg_eIwGkZ4JjD-adytAy-FU61uYY3_9jNYQ-TY9QmJJEo_UV-BjhtCXV09YISc=',
  workerUrl: '/service-worker.js'
});
