self.addEventListener('push', (event) => {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return
  }

  if (event.data) {
    const data = event.data.json()

    if (data.data?.silent) {
      return
    }

    const translations = {
      'de': {
        'title': 'Stadt Osnabrück',
        'body': 'Neue Mitteilung',
      },
      'en': {
        'title': 'City of Osnabrück',
        'body': 'New notification',
      },
      'fr': {
        'title': 'Ville d\'Osnabrück',
        'body': 'Nouvelle notification',
      },
      'nl': {
        'title': 'Stad Osnabrück',
        'body': 'Nieuwe melding',
      },
      'tr': {
        'title': 'Osnabrück Şehri',
        'body': 'Yeni bildirim',
      },
    }
    const lang = translations[data.data?.lang ? data.data?.lang : 'de']

    const title = data.title || lang.title
    const options = Object.assign({
      body: lang.body,
      icon: '/static/images/push-icon.png',
      badge: '/static/images/push-icon.png',
    }, data)

    event.waitUntil(
      self.registration.showNotification(title, options)
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'close') {
    return
  } else if (event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    )
  }
})