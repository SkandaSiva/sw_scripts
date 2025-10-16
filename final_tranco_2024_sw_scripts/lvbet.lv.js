importScripts('/casino/build-web/ngsw-worker.js');
importScripts('https://static.app.delivery/sdks/web/optimove-worker.js');

function getRouteLanguage() {
  try {
    const swPath = self.serviceWorker.scriptURL;
    const parsedSwPath = new URL(swPath);
    return parsedSwPath.searchParams.get('lang') || '';
  } catch (e) { }
  return '';
};

async function setAppBadge(pushData) {
  const appBadgeCount = (pushData.data || {}).count || 0;
  if (appBadgeCount > 0) {
    await navigator.setAppBadge(appBadgeCount);
  } else {
    await navigator.clearAppBadge();
  }
};

function pathToSegments(pathname) {
  if (pathname) {
    return pathname.split('/').filter((segment) => !!segment.trim());
  }
  return [];
};

function compareParsedUrls(parsedA, parsedB) {
  if (!parsedA || !parsedB) {
    return false;
  }
  let pathA = parsedA.pathname;
  let pathB = parsedB.pathname;
  pathA = pathToSegments(pathA).join('/');
  pathB = pathToSegments(pathB).join('/');
  return pathA === pathB;
};

function matchUrlOrPath(parsedScope, notificationUrls, routeLanguage) {
  const scopePathSegments = pathToSegments(parsedScope.pathname);
  try {
    for (const url of notificationUrls) {
      const parsedUrl = new URL(url, parsedScope.origin);
      const urlPathSegments = pathToSegments(parsedUrl.pathname);
      if (parsedScope.host.indexOf(parsedUrl.host) === -1) {
        return parsedUrl;
      }
      if (urlPathSegments.length >= scopePathSegments.length) {
        for (let i = 0; i < scopePathSegments.length; i++) {
          if (scopePathSegments[i] !== urlPathSegments[i] && urlPathSegments.indexOf(routeLanguage) > -1) {
            return parsedUrl;
          }
        }
      }
      if (routeLanguage && urlPathSegments.indexOf(routeLanguage) > -1) {
        return parsedUrl;
      }
    }
  } catch (e) { }

  return undefined;
};

function extractNotificationUrl(data) {
  const scope = self.registration.scope;
  const routeLanguage = getRouteLanguage();
  const notificationUrl = data.url || '';
  const notificationPath = data.pathname || '';
  const notificationUrls = (data.data || {}).urls || [];
  try {
    const parsedScope = new URL(scope);
    const splittedPath = notificationPath.split(' ').filter((path) => !!path.trim());
    const splittedUrl = notificationUrl.split(' ').filter((url) => !!url.trim());
    let matchedUrlOrPath;
    if (notificationUrls.length > 0) {
      matchedUrlOrPath = matchUrlOrPath(parsedScope, notificationUrls, routeLanguage);
    } else if (splittedPath.length > 0) {
      matchedUrlOrPath = matchUrlOrPath(parsedScope, splittedPath, routeLanguage);
    } else if (splittedUrl.length > 0) {
      matchedUrlOrPath = matchUrlOrPath(parsedScope, splittedUrl, routeLanguage);
    }
    if (!matchedUrlOrPath) {
      if (routeLanguage) {
        const scopePathSegments = pathToSegments(parsedScope.pathname);
        scopePathSegments.push(routeLanguage);
        parsedScope.pathname = scopePathSegments.join('/');
      }
      return parsedScope;
    }
    return matchedUrlOrPath;
  } catch (e) { }
  return undefined;
};

async function openUrl(data) {
  const extractedUrl = extractNotificationUrl(data);
  if (!extractedUrl) { return; }
  const clientList = await clients.matchAll({ type: 'window' });
  for (const client of clientList) {
    try {
      const parsedClientUrl = new URL(client.url);
      if (compareParsedUrls(parsedClientUrl, extractedUrl) && 'focus' in client) {
        await client.focus();
        return;
      }
    } catch (e) { }
  }
  if (clients.openWindow) {
    await clients.openWindow(extractedUrl.toString());
  }
};

function onPushReceived(event) {
  if (!(self.Notification && self.Notification.permission === "granted") || !event.data) {
    return;
  }
  const pushData = event.data.json();
  event.waitUntil(setAppBadge(pushData));
};

function onPushOpened(event) {
  if (!event.notification) {
    return;
  }
  event.notification.close();
  const notification = event.notification;
  if (notification) {
    const data = event.notification.data || {};
    event.waitUntil(openUrl(data));
  }
};

self.addEventListener('push', onPushReceived);
self.addEventListener('notificationclick', onPushOpened);
