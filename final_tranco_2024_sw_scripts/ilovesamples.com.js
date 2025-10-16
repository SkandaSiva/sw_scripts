var uri = 'https://api.pushnami.com/scripts/v2/pushnami-sw/',
    key = '5b637897d634027355ae72d2'; // mdmx

switch (self.location.hostname) {
    case 'www.divinepets.com':
        key = '5b4d6859d500dd00100637fb';
        break;
    case 'www.divineeats.com':
        key = '5b63784cdf4d4b27d9318ebc';
        break;
    case 'a.everydaywinner.com':
    case 'a.everydaywinner.net':
    case 'www.everydaywinner.com':
    case 'www.everydaywinner.net':
        key = '5b6378b561b71d0ad0423c7d';
        break;
    case 'www.ilovesamples.com':
        key = '5b6378c70646cf4dbbec6c0f';
        break;
    case 'worldofsweeps.com':
    case 'www.worldofsweeps.com':
        key = '65396473f3494c0de1ca6a36';
        break;
}

importScripts(uri+key);
