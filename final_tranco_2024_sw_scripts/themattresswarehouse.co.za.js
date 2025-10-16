/*
 * Service Worker (sw) for push notifications.
 */

/*global clients */

/* START GOOGLE ANALYTICS CODE */

const trackingId =
  self.location.hostname == "www.themattresswarehouse.co.za"
    ? "UA-78972663-1"
    : "UA-78972663-2"

let analyticsId = "not defined"

/*
 * function: emitGoogleAnalyticsEvent
 * send a custom event to Google Analytics
 *
 *  tracking_id (Required): Google Analytics tracking ID for this account
 *  analytics_id (Required): Unique ID for the current user
 *  event_name (Required): Name of the event in Google Analytics Dashboard
 *  event_category (Optional): Name of a group of events in Google Analytics Dashboard
 *  event_label (Optional): Longer description of the event in Google Analytics Dashboard
 */
const emitGoogleAnalyticsEvent = ({
  tracking_id,
  analytics_id,
  event_name,
  event_category,
  event_label,
}) => {
  const payloadData = {
    // Version Number
    v: 1,
    // Client ID
    cid: analytics_id,
    // Tracking ID
    tid: tracking_id,
    // Hit Type
    t: "event",
    // Event Category
    ec: event_category,
    // Event Action
    ea: event_name,
    // Event Label
    el: event_label,
  }

  const payloadString = Object.keys(payloadData)
    .filter((analyticsKey) => payloadData[analyticsKey])
    .map(
      (analyticsKey) =>
        analyticsKey + "=" + encodeURIComponent(payloadData[analyticsKey])
    )
    .join("&")

  fetch("https://www.google-analytics.com/collect", {
    method: "post",
    body: payloadString,
  }).catch((err) => console.error("GA Fetch error", err))
}

// GOOGLE ANALYTICS --- Push notification received
const gaPostNotifReceived = () =>
  emitGoogleAnalyticsEvent({
    tracking_id: trackingId,
    analytics_id: analyticsId,
    event_category: "Push Notifications",
    event_name: "Push Notification Received By The Browser",
    event_label: "The browser has received a push notification",
  })

// GOOGLE ANALYTICS --- Push notification closed (cancelled)
const gaPostNotifClosed = () =>
  emitGoogleAnalyticsEvent({
    tracking_id: trackingId,
    analytics_id: analyticsId,
    event_category: "Push Notifications",
    event_name: "Push Notification Cancelled By The Customer",
    event_label: "The customer has cancelled a push notification",
  })

// GOOGLE ANALYTICS --- Push notification clicked
const gaPostNotifClicked = () =>
  emitGoogleAnalyticsEvent({
    tracking_id: trackingId,
    analytics_id: analyticsId,
    event_category: "Push Notifications",
    event_name: "Push Notification Clicked By The Customer",
    event_label: "The customer has clicked a push notification",
  })
/* END GOOGLE ANALYTICS CODE */

// This function takes an analytics function as an argument and calls it
// after retrieving the analytics id from the DB
// includes a 5 second timeout
const callAnalyticsFunctionWithTimeout = (gaFunction) => {
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(resolve, 5000, "timeout")
  })
  const dbPromise = new Promise((resolve) => {
    if (typeof indexedDB == "undefined") {
      return resolve("error")
    } else {
      const openRequest = indexedDB.open("push_notification_data", 2)
      if (!openRequest) {
        return resolve("error")
      } else {
        openRequest.onerror = () => {
          return resolve("error")
        }
        openRequest.onsuccess = (event) => {
          const db = event?.target?.result
          const transaction = db?.transaction?.(["analyticsId"])
          const objectStore = transaction?.objectStore?.("analyticsId")
          const getRequest = objectStore?.get?.(1)
          getRequest.onerror = () => {
            return resolve("error")
          }
          getRequest.onsuccess = () => {
            if (getRequest?.result) {
              analyticsId = getRequest?.result
              return resolve(analyticsId)
            }
            return resolve("error")
          }
        }
      }
    }
  })
  Promise.race([timeoutPromise, dbPromise]).then(() => gaFunction())
}

self.onpush = (event) => {
  const analyticsPromise = callAnalyticsFunctionWithTimeout(gaPostNotifReceived)
  const notifcationDetails = { title: "The Mattress Warehouse Update" }
  if (event.data) {
    notifcationDetails.options = { body: event.data.text() }
    try {
      const notificationJsonData = event.data.json()
      if (!("title" in notificationJsonData)) {
        console.error("no 'title' property in notification payload")
      } else if (!("options" in notificationJsonData)) {
        console.error("no 'options' property in notification payload")
      } else {
        notifcationDetails.title = notificationJsonData.title
        notifcationDetails.options = notificationJsonData.options
      }
    } catch (error) {
      console.error("Error processing notification data", error)
    }
  }
  event.waitUntil(
    Promise.all([
      analyticsPromise,
      self.registration.showNotification(
        notifcationDetails.title,
        notifcationDetails.options
      ),
    ])
  )
}

self.onnotificationclose = (event) => {
  const analyticsPromise = callAnalyticsFunctionWithTimeout(gaPostNotifClosed)
  event.waitUntil(analyticsPromise)
}

self.onnotificationclick = (event) => {
  const analyticsPromise = callAnalyticsFunctionWithTimeout(gaPostNotifClicked)
  event.notification.close()
  const destUrl = event?.notification?.data?.destination ?? "/"

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    Promise.all([
      analyticsPromise,
      clients
        .matchAll({
          type: "window",
        })
        .then((clientList) => {
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i]
            if (client.url == destUrl && "focus" in client) {
              return client.focus()
            }
          }
          return clients?.openWindow?.(destUrl)
        }),
    ])
  )
}
