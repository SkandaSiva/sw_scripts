self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.includes("/_next/static/")) {
    event.respondWith(
      retryWithExponentialBackoff(event.request, event.clientId, {
        initialWaitTime: 250, // 500 ms
        maxWaitTime: 30000, // 30 seconds
        maxRetries: 5,
      })
    );
  }
});

/**
 * Fetches a request using an exponential backoff retry strategy.
 *
 * @param {Request} request - The request to be fetched.
 * @param {Object} options - The retry options.
 * @param {number} options.initialWaitTime - The initial waiting time (in milliseconds) before the first retry.
 * @param {number} options.maxWaitTime - The maximum waiting time (in milliseconds) for any single retry.
 * @param {number} options.maxRetries - The maximum number of retries allowed before giving up.
 * @returns {Promise<Response>} - A Promise that resolves with the fetch response, or the original fetch request as a fallback.
 */
async function retryWithExponentialBackoff(
  request,
  clientId,
  { initialWaitTime, maxWaitTime, maxRetries }
) {
  let retryCount = 0;

  // Retry the fetch request while the retry count is less than the maximum number of retries allowed.
  while (retryCount < maxRetries) {
    try {
      const requestClone = new Request(request, {
        headers: new Headers({
          ...Object.fromEntries(request.headers.entries()),
        }),
      });

      // Attempt to fetch the request.
      const response = await fetch(requestClone);

      // Only Imperva responses wouldn't have the CSP header.
      // Receiving an Imperva response means the user needs to pass captcha,
      // so we send a message to the main thread, so that the main thread can handle this case.
      try {
        const { headers } = response;
        const url = new URL(request.url);
        if (!headers.has("content-security-policy")) {
          // We only send the message to the tab that was making the request, because handling
          // the captcha in one tab is enough.
          clients.get(clientId).then((client) => {
            client.postMessage({
              msg: "WAF_CAPTCHA_REQUIRED",
              url: url.pathname,
            });
          });
          return;
        }
      } catch (e) {
        console.error("Exception while handling WAF responses", e);
      }

      // If the response status is not 503, return the response.
      if (response.status !== 503) {
        return response;
      }
    } catch (err) {
      // Log any fetch error.
      console.error(`Fetch failed with error: ${err}`);
      return new Response(err.toString(), { status: 500 });
    }

    // Increment the retry count.
    retryCount++;

    // Calculate the waiting time for the current retry using exponential backoff.
    // The formula for exponential backoff is:
    // wait_time = initial_wait_time * (2 ** retry_count)
    // However, we want to cap the waiting time at max_wait_time to prevent excessively long waiting times.
    //
    // In this formula:
    // - initial_wait_time is the initial waiting time before the first retry.
    // - retry_count is the current number of retries that have been attempted.
    //
    // By raising 2 to the power of the retry count, we exponentially increase the waiting time for each retry.
    // Using Math.min, we ensure that the waiting time does not exceed the maximum waiting time specified.
    const waitTime = Math.min(initialWaitTime * 2 ** retryCount, maxWaitTime);

    // Wait for the calculated waiting time before attempting the next retry.
    await sleep(waitTime);
  }

  // Fallback to the original fetch request after reaching the maximum number of retries.
  return fetch(request);
}

/**
 * Sleeps for the specified duration.
 *
 * @param {number} ms - The duration (in milliseconds) to sleep.
 * @returns {Promise<void>} - A Promise that resolves after the specified duration.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
