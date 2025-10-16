async function sendAnalyticsSegment({
	config,
	fanId,
	eventName,
	eventProperty,
	theme,
}) {
    await fetch(`${config.segment_url}/segment/`, {
        method: 'POST',
        headers: {
            'x-api-key': config.segment_api_key,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            method: 'track',
            body: {
                userId: fanId.includes('auth') ? fanId : undefined,
                anonymousId: fanId.startsWith('guest') ? fanId : undefined,
                event: eventName,
                properties: eventProperty,
                source: theme,
            }
        }),
    });
}

addEventListener("message", (event) => {
    sendAnalyticsSegment(event.data);
});
self.importScripts('https://js.appboycdn.com/web-sdk/5.3/service-worker.js');