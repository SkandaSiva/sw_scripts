self.addEventListener('push', (event) => {
  const trackWebPushDelivery = (webPushReportId) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
  
    const body = JSON.stringify({
      event: "delivered",
      webPushReportId,
    });
  
    const requestOptions = {
      method: "PUT",
      headers,
      body,
      redirect: "follow",
    };
  
    fetch("https://jmptywoxpa.execute-api.us-east-1.amazonaws.com/prod/webPush/deliveryReport", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  const getImageByDevice = (image) => {
    if (image.windows && navigator.userAgent.indexOf("Win") != -1) {
      return image.windows;
    }
    if (image.mac && navigator.userAgent.indexOf("Mac") != -1) {
      return image.mac;
    }
    if (image.android && navigator.userAgent.match("/Android/i")) {
      return image.android;
    }
    return image.default;
  };

  const payload = event.data.json()

  const image = getImageByDevice(payload.image)
  const icon =
    navigator.userAgent.indexOf("Mac") != -1 && image
      ? image
      : payload.icon;

  console.log('Push Notification received', JSON.stringify(event))
  const options = {
    body: payload.body,
    icon,
    image,
    actions: payload.actions,
    link: payload.url,
    data: payload.data,
  }
  event.waitUntil(self.registration.showNotification(payload.title, options))

  trackWebPushDelivery(payload.data.webPushReportId)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.action || event?.notification?.data?.url))
})
