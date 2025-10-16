const cacheName = 'my-cache-v2';
const apiUrl = '/templatedata/backupapi.txt';
const apiUrl_live = '/templatedata/backupapi_live.txt';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                return cache.addAll([apiUrl, apiUrl_live]);
            })
    );
});

// ��ȡ���������ͱ����������뵱ǰ�������бȽ�
function checkDomainAvailability() {
    return caches.open(cacheName)
        .then(function (cache) {
            const url = location.hostname.toLowerCase().indexOf('live') > -1 ? apiUrl_live : apiUrl;
            return cache.match(url)
                .then(function (response) {
                    if (response) {
                        return response.text();
                    } else {
                        throw new Error('Cached file not found');
                    }
                })
                .then(function (data) {
                    return fetch(data)
                        .then(function (response) {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(function (data) {
                            const latestDomain = data.curl;
                            const backupDomain = data.burl;
                            const status = data.s;
                            if (status == '1') {
                                if (latestDomain.indexOf(location.hostname) == -1) {
                                    return Response.redirect(latestDomain);
                                } else {
                                    return Response.redirect(backupDomain);
                                }
                            }
                        })
                        .catch(function (error) {
                            console.error('Fetch error:', error);
                        })
                })
        });
}

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request)
            .catch(function (error) {
                if (event.request.headers.get('accept').includes('text/html')) {
                    return fetch('https://' + location.hostname)
                        .catch(function (error) {
                            return checkDomainAvailability();
                        });
                }
            })
    );
});