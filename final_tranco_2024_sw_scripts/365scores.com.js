if ('BroadcastChannel' in self) {
  // BroadcastChannel API supported!
  const channel = new BroadcastChannel('bi_user_data');

  // Listen for messages on "notifications_user_data".
  channel.onmessage = function (e) {
    self.defaultUserData = e.data.userData;
  }
}

self.addEventListener('install', () => {
  if ('BroadcastChannel' in self) {
    // BroadcastChannel API supported!
    const channel = new BroadcastChannel('bi_user_data');

    // Listen for messages on "notifications_user_data".
    channel.postMessage({
      cmd: 'send_base_event'
    });
  }
})

self.addEventListener('push', function (event) {
  const eventData = event.data.json();
  console.log('push notification data', eventData);
  console.log('notification arrived bi event', self.defaultUserData);
  sendEvent('arrived');

  event.waitUntil(buildUrl(eventData).then((url) => {
      const title = eventData.title;
      const defaultIcon = 'https://imagecache.365scores.com/image/upload/v1606037472/Notifications/Web/default_icon_logo.png';
      const defaultBadge = 'https://imagecache.365scores.com/image/upload/Notifications/Web/badge_white.png';

      const options = {
        body: eventData.text,
        icon: eventData.icon || defaultIcon,
        badge: eventData.badge || defaultBadge,
        data: {
          url
        }
      }

      return self.registration.showNotification(title, options);
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  console.log('notification click data', event.notification.data);
  console.log('notification click bi event', self.defaultUserData);
  sendEvent('click');
  const eventData = event.notification.data;
  let url = eventData.url;

  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

async function buildUrl(eventData) {
  const ENTITY_TYPES = {
    sport: 'sport',
    competition: 'competition',
    competitor: 'competitor',
    game: 'game',
    athlete: 'athlete',
  }

  const entityUrlBuilder = {
    [ENTITY_TYPES.competition]: null,
    [ENTITY_TYPES.competitor]: null,
    [ENTITY_TYPES.sport]: null,
    [ENTITY_TYPES.game]: buildGameUrl,
    [ENTITY_TYPES.athlete]: null
  }

  try {
    return eventData.url ? await eventData.url : await entityUrlBuilder[eventData.entityType](eventData.entityId, eventData.websiteLang);
  } catch (e) {
    console.warn('Notifications Service Worker: build url failed for entityType: ' + eventData.entityType + ' entityId: ' + eventData.entityId);
    const langParam = eventData.websiteLang ? `/${eventData.websiteLang}` : '';

    return `https://www.365scores.com${langParam}/`
  }
}

async function buildGameUrl(id, lang) {
  const fetchUrl = `https://webws.365scores.com/web/game/?gameId=${id}`;

  return fetch(fetchUrl)
    .then((res) => res.json()).then((responseJson) => {
      const game = responseJson.game;
      const sport = responseJson.sports.find((sport) => sport.id === game.sportId);
      const sportName = sport.nameForURL;

      const competition = responseJson.competitions.find((competition) => competition.id === game.competitionId);
      const competitionName = competition.nameForURL;

      const country = responseJson.countries.find((country) => country.id === competition.countryId);
      const countryName = country.nameForURL;

      const homeCompetitorName = game.homeCompetitor.nameForURL;
      const awayCompetitorName = game.awayCompetitor.nameForURL;

      const homeCompetitorId = game.homeCompetitor.id;
      const awayCompetitorId = game.awayCompetitor.id;
      const competitionId = competition.id;

      const firstCompetitorId = homeCompetitorId < awayCompetitorId ? homeCompetitorId : awayCompetitorId;
      const secondCompetitorId = homeCompetitorId < awayCompetitorId ? awayCompetitorId : homeCompetitorId;

      const matchupId = `${firstCompetitorId}-${secondCompetitorId}-${competitionId}`;

      const langParam = lang ? `/${lang}` : '';

      const url = `https://www.365scores.com${langParam}/${sportName}/${countryName}/${competitionName}/match/${homeCompetitorName}-${awayCompetitorName}/${matchupId}#id=${id}`;

      return url;
    }).catch((e) => {
      console.warn('Notifications Service Worker: game fetch exception for gameId: ' + id);

      const langParam = lang ? `/${lang}` : '';

      return `https://www.365scores.com${langParam}/`
    });
}

async function sendEvent(label) {
  const eventModel = createEventModel(label);

  return fetchEvent(eventModel);
}

function createEventModel(label) {
  let eventModel = self.defaultUserData || {};

  const additionalData = {
    event_name: `web_notification_${label}`,
    properties: {
      data: JSON.stringify({
        visitor_id: '0.00000000000',
        ...(eventModel || {}),
        level_1: 'web',
        level_2: 'notification',
        level_3: label,
        event_name: `web_notification_${label}`,
        event_datetime: format(new Date(), 'dd/MM/yyyy hh:mm'),
        datekey: (new Date()).valueOf(),
        url: null,
        source: null
      }),
      table: "365.public.fact_events_web_events"
    }
  }

  return additionalData;
}

async function fetchEvent(eventModel) {
  const url = 'https://statistics.365scores.com/mix_panel';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const method = 'POST';
  const body = new URLSearchParams();
  body.append('data', btoa(JSON.stringify([eventModel])))

  return fetch(url, {method, headers, body})
}

format = function date2str(x, y) {
  var z = {
    M: x.getMonth() + 1,
    d: x.getDate(),
    h: x.getHours(),
    m: x.getMinutes(),
    s: x.getSeconds()
  }
  y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
    return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
  });

  return y.replace(/(y+)/g, function (v) {
    return x.getFullYear().toString().slice(-v.length)
  });
}

self.addEventListener('error', function(e) {
  console.log(e.filename, e.lineno, e.colno, e.message);
});
