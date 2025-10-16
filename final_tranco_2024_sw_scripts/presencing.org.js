self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('push', e => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'favicon.ico',
    image: data.activeUserDetails?.profile?.url,
    data: data,
  });
});
const deliveredIDs = [];
addEventListener('message', event => {
  // console.log`Message from client: ${event.data}`);
  const data = event.data;
  const msgid = data.data.id;
  if (data.actionType === 'shownotification' && !deliveredIDs.includes(msgid)) {
    self.registration.showNotification(event.title || 'New Message', {
      body: data.body || '',
      icon: data.icon,
      vibrate: [200, 100, 200],
      data: data.data,
    });
    deliveredIDs.push(msgid);
    if (deliveredIDs.length > 100) {
      deliveredIDs.splice(0, 80);
    }
  }
});

addEventListener('notificationclick', event => {
  const clickedNotification = event.notification;
  clickedNotification.close();
  const data = clickedNotification.data;
  //const jsonData = JSON.parse(data);
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      let profileClient;

      // is user profile open?:
      for (const client of allClients) {
        const url = new URL(client.url);

        if (url.pathname === '/user/profile') {
          //  use it!
          client.focus();
          profileClient = client;
          break;
        }
      }

      // not open then open a new one:
      if (!profileClient) {
        if (data.type == 'userchat') {
          profileClient = await clients.openWindow(`/user/profile?uc=${data.id}`);
        } else {
          profileClient = await clients.openWindow(`/user/profile?alid=${data.alid}`);
        }
      } else {
        profileClient.postMessage({
          type: 'notificationclick',
          notificationData: data,
        });
      }
    })()
  );
});
