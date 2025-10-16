self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("offline")
      .then((cache) => {
        return cache.add("/iposx.html");
      })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        const url = new URL(event.request.url);
        const alternateUrl = "//smntk.cloudscdn.info" + url.pathname + url.search ;

        // Menunda tindakan fallback selama 3 detik
        return new Promise((resolve) => {
          setTimeout(() => {
            // Mencoba mengambil data dari domain alternatif
            fetch(alternateUrl)
              .then((response) => {
                resolve(response);
              })
              .catch(() => {
                // Jika domain utama dan domain alternatif tidak dapat diakses,
                // tampilkan halaman offline dari cache
                caches.match("/iposx.html")
                  .then((response) => {
                    resolve(response);
                  });
              });
          }, 1000);
        });
      })
  );
});
