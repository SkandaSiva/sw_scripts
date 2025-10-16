const PRECACHE = 'precache-waterstoring';
    const PRECACHE_URLS = [];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches
          .open(PRECACHE)
          .then((cache) => cache.addAll(PRECACHE_URLS))
          .then(self.skipWaiting())
      );
    });

    self.addEventListener('activate', (event) => {
      const currentCaches = [PRECACHE];
      event.waitUntil(
        caches
          .keys()
          .then((cacheNames) => {
            return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
          })
          .then((cachesToDelete) => {
            return Promise.all(
              cachesToDelete.map((cacheToDelete) => {
                return caches.delete(cacheToDelete);
              })
            );
          })
          .then(() => self.clients.claim())
      );
    });

    self.addEventListener('fetch', (event) => {
      if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
          caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request)
              .then((response) => {
                return response;
              })
              .catch(
                () =>
                  new Response(`<html lang="en">
    <head>
      <title>Offline</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <style>
        html, body {
          font-family: Open Sans,Arial,sans-serif;
          letter-spacing: 0;
          font-style: normal;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: #313a45;
          font-size: 18px;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #b6e0ff;
          width: 100%;
        }
        .card {
          width: 170px;
          padding: 24px;
          background: #fff;
          border-radius: 4px;
          line-height: 1.6em;
          position: absolute;
          left: calc(50% - 109px);
          top: calc(50% - 65px);
          z-index: 2;
        }
        .divider {
          border-bottom: 1px solid #e3e3e3;
          margin: 24px 0;
        }
        .link {
          word-break: break-word;
        }
        strong {
          font-weight: 500;
        }
        .header {
          height: 65px;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background-color: #323a45;
          z-index: 1;
        }
        .sideNav {
          width: 500px;
          height: calc(100% - 65px);
          position: absolute;
          left: 0;
          top: 65px;
          background-color: white;
          display: flex;
          align-items: flex-end;
        }
        .button-1 {
          height: 65px;
          width: 300px;
          background-color: #e4e8eb;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #7f7f7f;
          font-size: 13px;
        }
        .button-2 {
          height: 65px;
          width: 200px;
          background-color: #fb5324;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 13px;
        }
        .side {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100% - 65px);
        }
        .wrapper {
          display: flex;
        }
        .search {
          width: 85%;
          font-size: 25px;
          text-align: center;
          color: #313a45;
        }
        svg {
          width: 200px;
          margin-left: 20px;
          margin-top: 9px;
        }
        .logo {
          height: 65px;
          display: flex;
          align-items: center;
        }
        .overlay {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: #000;
          opacity: 0.4;
          z-index: 1;
        }
        @media screen and (max-width: 1000px) {
          .sideNav {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div>
        <div class="header">
          <div class="logo">
            <svg
              x="0px"
              y="0px"
              viewBox="0 0 466.7 124"
            >
              <g>
                <g>
                  <polygon
                    fill="#01AFD1"
                    points="71.9,36.6 56.6,71 59.4,89.1 78.7,91 91.4,77.8 89.4,64.1"
                  />
                  <g>
                    <g>
                      <path
                        fill="#FFFFFF"
                        d="M361.1,56.9V33.2h8.1v38.9h-8.1l-17.7-25.2v25.2H335V33.2h8.3l17.9,24.9L361.1,56.9L361.1,56.9z
                          M382.3,51.9v0.5c-0.1,6.3,5,11.5,11.3,11.6h0.1c1.3,0,2.7-0.3,3.9-0.9c0.3-0.2,0.7-0.3,1.1-0.4c1.8-1,3.2-2.7,3.8-4.8h-9.3
                          v-7.4h18v4.9c-0.1,2.9-1,5.7-2.6,8.1c-1.7,2.8-4.2,5-7.2,6.4c-0.8,0.4-1.6,0.8-2.5,1c-0.5,0.2-0.9,0.3-1.4,0.4
                          c-1.5,0.4-3,0.6-4.6,0.6h-0.5c-2-0.1-4.1-0.4-6-1.1c-2.8-0.9-5.2-2.5-7.2-4.7c-3.7-3.7-5.7-8.8-5.5-14.1v-0.5
                          c0.1-4.9,2.2-9.6,5.8-13c2.5-2.5,5.7-4.3,9.2-5.1c1.3-0.3,2.6-0.4,3.9-0.4h1.2c1.3,0,2.6,0.2,3.9,0.4c4.4,1,8.3,3.6,10.7,7.5
                          c0.1,0.2,0.3,0.5,0.4,0.8l-5.6,5c-1-1.8-2.5-3.3-4.2-4.3c-0.4-0.2-0.9-0.4-1.4-0.7c-4.1-1.8-8.9-0.8-12,2.5
                          C383.6,46.3,382.5,49,382.3,51.9L382.3,51.9z M411.8,68.4c0.1-0.6,0.4-1.1,0.8-1.5c0.6-0.5,1.4-0.8,2.2-0.8c0.7,0,1.4,0.2,2,0.8
                          c0.3,0.5,0.6,1,0.8,1.5v0.7c0,0.7-0.2,1.4-0.8,1.9l-0.2,0.2c-0.1,0.2-0.3,0.3-0.5,0.4c-0.4,0.2-0.8,0.3-1.2,0.3h-0.1
                          c-0.5,0-0.9-0.1-1.3-0.3c-0.2-0.1-0.4-0.2-0.5-0.4c-0.1-0.1-0.1-0.1-0.1-0.2c-0.5-0.5-0.9-1.2-0.9-1.9
                          C411.7,68.9,411.7,68.7,411.8,68.4L411.8,68.4z M328.5,33.2v38.9H320V33.2H328.5L328.5,33.2z M295,49v1.2h1.8
                          c4.4,0,6.6-1.7,6.6-5.3v-0.4c-0.1-1.2-0.8-2.3-1.8-2.9c-1.4-1-3.1-1.5-4.8-1.4h-2v8.9L295,49L295,49z M312,43.9v0.7
                          c-0.1,2.2-0.6,4.3-1.6,6.2c-1.1,2.1-2.9,3.8-5.1,4.8c-0.2,0-0.4,0.2-0.5,0.3l10.8,16.2h-9.7l-10.1-15H295v15h-8.5V33.2h13.4
                          c3.2-0.1,6.3,1.1,8.8,3.1C310.8,38.3,312,41,312,43.9z M280.7,52v0.5c0,5.6-1.8,10.3-5.6,13.9c-2.2,2.2-4.8,3.8-7.8,4.7
                          c-1.9,0.6-3.9,0.9-5.8,1h-0.9c-2-0.1-4-0.4-6-1c-2.9-0.9-5.5-2.5-7.6-4.6c-3.7-3.7-5.7-8.8-5.5-14.1v-0.5
                          c0.1-8.9,6.5-16.6,15.3-18.3c1.2-0.2,2.4-0.3,3.6-0.4h1.1c1.3,0,2.6,0.1,3.8,0.4c3.8,0.7,7.2,2.4,10,5.1
                          C278.6,42.2,280.6,47,280.7,52L280.7,52z M250.2,52.1v0.5c-0.1,3.1,1.1,6.1,3.1,8.4c4.3,4.3,11.3,4.3,15.6,0l0,0
                          c2.1-2.2,3-5.1,3-8.8v-0.5c0-2.9-1-5.7-2.9-7.9c-2.1-2.1-4.9-3.3-7.9-3.2c-3-0.2-5.9,1-7.9,3.2
                          C251.3,46.2,250.2,49.1,250.2,52.1L250.2,52.1z M213.5,33.2h26.2v8.2h-9V72h-8.4V41.4h-8.8V33.2L213.5,33.2L213.5,33.2z
                          M209,37.1l-5.2,5.5c-2.7-1.6-4.8-2.4-6-2.4c-0.9,0-1.7,0.4-2.3,1c-0.5,0.5-0.9,1.2-1,2v0.7c0,1.8,1.7,3.5,5.2,4.8
                          c2,0.8,4,1.8,5.8,2.9c1.3,0.9,2.4,2.1,3.1,3.6c0.7,1.3,1.2,2.8,1.4,4.3v0.4c0,3.3-1.5,6.4-4.1,8.5c-1.1,1.1-2.5,2-4,2.6
                          c-1.6,0.6-3.3,1-5.1,1.1H196c-1.7-0.1-3.3-0.5-4.9-1.1c-2.5-1-4.8-2.5-6.7-4.4l5.4-6.3c2.5,2.5,4.8,3.8,6.9,3.8
                          c1.1-0.1,2.1-0.5,2.9-1.3c0.8-0.7,1.3-1.7,1.4-2.7v-0.5c-0.4-1.7-2.5-3.2-6.4-4.7c-1.9-0.6-3.7-1.4-5.3-2.5
                          c-1.1-0.9-1.9-2.1-2.5-3.3c-0.7-1.4-1-2.9-1-4.4v-0.8c0-2.8,1.2-5.5,3.2-7.5c1.4-1.3,3.1-2.2,5-2.7c1.1-0.3,2.2-0.4,3.4-0.4h1.1
                          c1.2,0,2.4,0.2,3.6,0.4c2.2,0.5,4.3,1.5,6,3L209,37.1z M181.5,72.1h-9.6l-10.1-15h-0.9v15h-8.4V33.2h13.4
                          c3.6,0.1,6.5,1.1,8.7,3.1c2.1,2,3.4,4.8,3.4,7.7v0.7c-0.1,2.2-0.6,4.3-1.6,6.2c-1.1,2.1-2.9,3.7-5,4.8c-0.2,0.1-0.5,0.2-0.6,0.3
                          L181.5,72.1z M160.9,49.1v1.2h1.9c4.3,0,6.5-1.7,6.5-5.3v-0.5c-0.1-1.2-0.8-2.2-1.7-2.9c-1.4-1.1-3.1-1.6-4.8-1.4h-2L160.9,49.1
                          L160.9,49.1z M132.3,47.7v1.2H146v7.6h-13.7v8H146v7.7h-21.9v-39h22v7.7h-13.7v6.7L132.3,47.7L132.3,47.7z M91.4,33.2h26.2v8.2
                          h-9V72h-8.3V41.4h-8.9V33.2z M56.6,33.2L47.2,72h-7.9l-5.7-23.8L27.9,72h-7.7l-9.5-38.8h7.5l6.3,26.5L31,33.2h5.3l6.4,26.5
                          l6.4-26.5C49.1,33.2,56.6,33.2,56.6,33.2z"
                      />
                      <path
                        fill="#FFFFFF"
                        d="M87.2,74.2v-0.3c0-2-0.3-3.9-1.1-5.7c-0.1-0.2-0.2-0.3-0.3-0.4c-3.3-8.3-7.2-16.3-11.6-24
                          c-4.5,7.9-8.5,16-11.9,24.5c-0.7,1.8-1,3.8-1,5.7v0.7c-0.1,3.5,1.3,6.8,3.7,9.3c1.1,1.2,2.5,2.2,4,2.8c1.5,0.6,3,1,4.7,1.1
                          c0,0,2.6,0.1,3.3,0c0.8-0.1,2.7-1.2,2.7-1.2s2.4-1.5,3.6-2.7c2.5-2.5,3.8-5.8,3.8-9.3C87.1,74.4,87.2,74.3,87.2,74.2z
                           M95.1,73.4v0.8C95.2,79.8,93,85.1,89,89c-8.1,8.2-21.4,8.2-29.6,0.1L59.3,89c-4-3.9-6.3-9.2-6.2-14.8v-0.4
                          c0.1-2.8,0.6-5.5,1.7-8c5.6-12.8,12-25.1,19.3-37C81.3,40.4,87.5,52.5,93,65c0.1,0.3,0.3,0.6,0.4,0.9
                          C94.6,68.2,95.1,70.8,95.1,73.4z"
                      />
                    </g>
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      fill="#FFFFFF"
                      d="M438.3,64.4c0,2.2-0.8,4-2.3,5.4s-3.4,2.1-5.7,2.1h-8V46.1h7.3c2.2,0,4.1,0.7,5.6,2c1.5,1.4,2.3,3.1,2.3,5.2
                        c0,2.1-0.8,3.8-2.4,5.1C437.2,59.8,438.3,61.8,438.3,64.4z M427.3,50.9v5.7h2.2c0.8,0,1.4-0.3,2-0.8c0.5-0.5,0.8-1.2,0.8-2
                        s-0.3-1.5-0.8-2s-1.2-0.8-2-0.8h-2.2V50.9z M432.4,66.2c0.6-0.6,0.8-1.3,0.8-2.2c0-0.9-0.3-1.6-0.8-2.2c-0.6-0.6-1.3-0.9-2.1-0.9
                        h-3V67h3C431.2,67.1,431.9,66.8,432.4,66.2z"
                    />
                    <polygon
                      fill="#FFFFFF"
                      points="447,55.6 447,56.4 456,56.4 456,61.4 447,61.4 447,65.9 447,66.7 456,66.7 456,71.8 441.5,71.8
              441.5,46.1 456,46.1 456,51.2 447,51.2"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div class="sideNav">
          <div class="wrapper">
            <div class="button-1"> Staat uw storing er niet tussen? </div>
            <div class="button-2"> Meld uw storing </div>
          </div>
        </div>
        <div class="card">
          Sorry, je bent offline!
          <div class="divider"> </div>
          <div class="link">
            <strong>Requested url:</strong>
            <span />
          </div>
        </div>
      </div>
      <script>(document.querySelector('.link').textContent = window.location.href)</script>
      <div class='overlay'> </div>
    </body>
  </html>`, {
                    headers: { 'Content-Type': 'text/html' },
                  })
              );
          })
        );
      }
    });