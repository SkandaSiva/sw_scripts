importScripts('./ngsw-worker.js');

const notificationBaseUrl = 'https://www.tvsaccelerator.com/notification-interceptor;';
self.addEventListener('notificationclick', function (event) {
  let endpoint = JSON.parse(event.notification.data).action;
  endpoint = checkForEndPoint(endpoint, event);

  const url = checkForEnquiryAction(JSON.parse(event.notification.data), endpoint);
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow && event.action !== 'no') {
        return clients.openWindow(url);
      }
    }),
  );
});

function checkForEndPoint(endpoint, event) {
  if (endpoint === 'non-promoter-score') {
    if (event.action === 'nps-dashboard') {
      return 'nps-dashboard';
    } else {
      return 'cce-feedback';
    }
  } else if (endpoint === 'recovery-status-change') {
    if (event.action === 'enquiry-details') {
      return 'enquiry-details';
    } else {
      return 'cce-feedback';
    }
  } else {
    return endpoint;
  }
}

function checkForEnquiryAction(notificationData, endpoint) {
  let url = notificationBaseUrl + 'action=' + endpoint;
  if (endpoint === 'edit-enquiry') {
    url =
      notificationBaseUrl +
      'action=' +
      endpoint +
      ';' +
      'enquiryId=' +
      notificationData.enquiry_id +
      ';' +
      'notificationName=' +
      notificationData.notification_name +
      ';' +
      'source=' +
      notificationData.source +
      ';' +
      'notificationId=' +
      notificationData.notification_id;
  }
  if (endpoint === 'view-sales-executive-details') {
    url =
      notificationBaseUrl +
      'action=' +
      endpoint +
      ';' +
      'userId=' +
      notificationData.userId +
      ';' +
      'notificationName=' +
      notificationData.notification_name +
      ';' +
      'source=' +
      notificationData.source +
      ';' +
      'notificationId=' +
      notificationData.notification_id;
  }
  if (endpoint === 'missed-enquiries') {
    url =
      notificationBaseUrl +
      'action=' +
      endpoint +
      ';' +
      'role=' +
      notificationData.role +
      ';' +
      'notificationName=' +
      notificationData.notification_name +
      ';' +
      'source=' +
      notificationData.source +
      ';' +
      'notificationId=' +
      notificationData.notification_id;
  }
  if (endpoint === 'cce-feedback') {
    url =
      notificationBaseUrl +
      'action=' +
      endpoint +
      ';' +
      'enquiryId=' +
      notificationData.enquiry_id +
      ';' +
      'feedbackType=' +
      notificationData.feedback_type +
      ';' +
      'notificationName=' +
      notificationData.notification_name +
      ';' +
      'source=' +
      notificationData.source +
      ';' +
      'notificationId=' +
      notificationData.notification_id;
  }
  if (endpoint === 'customer-episode-mapping') {
    url =
      notificationBaseUrl +
      'action=' +
      endpoint +
      ';' +
      'enquiryId=' +
      notificationData.enquiry_id +
      ';' +
      'notificationName=' +
      notificationData.notification_name +
      ';' +
      'source=' +
      notificationData.source +
      ';' +
      'notificationId=' +
      notificationData.notification_id;
  }
  if (endpoint === 'enquiry-details') {
    url =
      notificationBaseUrl +
      'action=' +
      endpoint +
      ';' +
      'enquiryId=' +
      notificationData.enquiry_id +
      ';' +
      'notificationName=' +
      notificationData.notification_name +
      ';' +
      'source=' +
      notificationData.source +
      ';' +
      'notificationId=' +
      notificationData.notification_id;
  }
  if (endpoint === 'test-ride-details') {
    url = notificationBaseUrl 
    + 'action=' + 
    endpoint + ';' + 
    'enquiryId=' + 
    notificationData.enquiry_id +
    'notificationName=' +
    notificationData.notification_name +
    ';' +
    'source=' +
    notificationData.source +
    ';' +
    'notificationId=' +
    notificationData.notification_id;
  }
  if (endpoint === 'nps-dashboard') {
    url =
      notificationBaseUrl +
      'action=' +
      endpoint +
      ';' +
      'notificationName=' +
      notificationData.notification_name +
      ';' +
      'source=' +
      notificationData.source +
      ';' +
      'notificationId=' +
      notificationData.notification_id;
  }
  if (endpoint === 'view-action-items') {
    url =
      notificationBaseUrl +
      'action=' +
      endpoint +
      ';' +
      'meetingId=' +
      notificationData.clf_meeting_id +
      ';' +
      'notificationName=' +
      notificationData.notification_name +
      ';' +
      'source=' +
      notificationData.source +
      ';' +
      'notificationId=' +
      notificationData.notification_id;
  }
  if (endpoint === 'enquiry_list') {
    url =
      notificationBaseUrl +
      'action=' +
      endpoint +
      ';' +
      'notificationName=' +
      notificationData.notification_name +
      ';' +
      'source=' +
      notificationData.source +
      ';' +
      'role=' +
      notificationData.role +
      ';' +
      'notificationId=' +
      notificationData.notification_id;
  }
  if (endpoint === 'training_rec') {
    url =
      notificationBaseUrl +
      'action=' +
      encodeURIComponent(endpoint) +
      ';' +
      'notificationName=' +
      encodeURIComponent(notificationData.notification_name) +
      ';' +
      'source=' +
      encodeURIComponent(notificationData.source) +
      ';' +
      'trainingModuleUrl=' +
      encodeURIComponent(notificationData.training_module_url) +
      ';' +
      'notificationId=' +
      encodeURIComponent(notificationData.notification_id);
  }
  if (endpoint === 'test_ride_overdue_rec') {
    url =
      notificationBaseUrl +
      'action=' +
      endpoint +
      ';' +
      'notificationName=' +
      notificationData.notification_name +
      ';' +
      'source=' +
      notificationData.source +
      ';' +
      'role=' +
      notificationData.role +
      ';' +
      'notificationId=' +
      notificationData.notification_id;
  }
  if (endpoint === 'receptionist-dashboard') {
    url =
      notificationBaseUrl +
      'action=' +
      endpoint +
      ';' +
      'enquiryId=' +
      notificationData.enquiry_id +
      ';' +
      'notificationName=' +
      notificationData.notification_name +
      ';' +
      'source=' +
      notificationData.source +
      ';' +
      'notificationId=' +
      notificationData.notification_id;
  }
  if (endpoint === 'cancelled-booking-details') {
    url = notificationBaseUrl + 'action=' + endpoint + ';' + 'enquiryId=' + notificationData.enquiry_id;
  }
  if (endpoint === 'booking-details') {
    url = notificationBaseUrl + 'action=' + endpoint + ';' + 'enquiryId=' + notificationData.booking_id;
  }
  return url;
}
