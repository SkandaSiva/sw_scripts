self.addEventListener("push", function(event) {
  var data = JSON.parse(event.data.text())
  var title = data.title;
  var body = data.body;
  var url = data.url;
  var tag = data.tag;
  var renotify = data.renotify;
  var icon = data.icon;
  var open_push_log_url = data.open_push_log_url;
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag,
      renotify: renotify,
      data: {
        url: url,
        open_push_log_url: open_push_log_url
      }
    })
  );
});

self.addEventListener("notificationclick", function(event) {
  const clickedNotification = event.notification;
  clickedNotification.close();
  if (!!clickedNotification.data.url && !!clickedNotification.data.open_push_log_url) {
    event.waitUntil(
      fetch(clickedNotification.data.open_push_log_url, {
        method: 'GET',
        mode: 'no-cors'
      })
      .then(function (responseData) {
        clients.openWindow(clickedNotification.data.url)
      })
      .catch(function (err) {
        clients.openWindow(clickedNotification.data.url)
      })
    );
  } else if (!!clickedNotification.data.open_push_log_url) {
    event.waitUntil(
      fetch(clickedNotification.data.open_push_log_url, {
        method: 'GET',
        mode: 'no-cors'
      })
      .then(function (responseData) {
        // Nothing for now
      })
      .catch(function (err) {
        // Nothing for now
      })
   );
  } else if (!!clickedNotification.data.url) {
    event.waitUntil(
      clients.openWindow(clickedNotification.data.url)
    );
  }
});
