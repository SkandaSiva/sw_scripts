
// Listen for the response from the service worker
self.addEventListener('message', async (event) => {
  if (event.data.type === 'syncPostpaidData') {
    const localStorageData = event.data.data;
    const csrfToken = event.data.token;
    const response = await syncPostpaidData(localStorageData, csrfToken);
    if (response !== 'success') {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'syncPostpaidDataResponse', success: false });
        });
      });
    }
  }
});

async function syncPostpaidData(data, csrfToken) {
  // Check if data exists
  if (data) {
    const response = await fetch(`/edanz/postpaid_order_temp_sync`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });
    if (response.status === 200) {
      return 'success';
    } else {
      return 'failed';
    }
  }
}
