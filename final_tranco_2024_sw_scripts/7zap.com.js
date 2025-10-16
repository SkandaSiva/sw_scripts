self.addEventListener('message', event => {
    const { type, eventType, eventData, timestamp } = event.data;
    if (type === 'STAT_EVENT') {
        saveEvent(eventType, eventData, timestamp);
    }
});

function saveEvent(eventType, eventData, timestamp) {
    const event = { eventType, eventData, timestamp };
    fetch('https://stat.7zap.com/api/saveEvent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    }).catch(error => {
        console.error('Error sending event to server:', error);
    });
}