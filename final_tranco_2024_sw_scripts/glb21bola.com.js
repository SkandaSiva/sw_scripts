const getSitemap = async () => {
    try {
      const response = await fetch("/content/stmp",
        {
          method: "GET",
          credentials: "omit",
          headers: {
            'Content-Type': 'application/json',
            'x-customblhdrs' : 'bd2210a7c0e0a6ebf2de4416b41a9c2cee8920a274a976c24b96d6c16b51f0773fa3e4cbe90754e2958a54c96f404cc78040e2b0131c2efd5137effaffa1142b'
          },
        },
      );
  
      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        console.error("Failed to fetch data from API");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
      return null;
    }
  };
  
  const generateSitemapContent = (domain, data) => {
    const today = new Date().toISOString().split('T')[0];
  
    const staticUrl = `
  <url>
    <loc>${domain}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
  
    const dynamicUrls = data.map(item => `
  <url>
    <loc>${domain}/${item.urpage}</loc>
    <lastmod>${item.updated_at}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('');
  
    return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrl}
    ${dynamicUrls}
  </urlset>`;
  };
  
  self.addEventListener('fetch', (event) => {
    if (event.request.url.endsWith('/sitemap.xml')) {
      const url = new URL(event.request.url);
      const domain = `${url.protocol}//${url.hostname}`;
  
      event.respondWith(
        getSitemap().then(data => {
          if (data) {
            const sitemapContent = generateSitemapContent(domain, data);
            return new Response(sitemapContent, {
              headers: { 'Content-Type': 'application/xml' }
            });
          } else {
            return new Response('Failed to fetch sitemap data', { status: 500 });
          }
        }).catch(error => {
          console.error('Error:', error);
          return new Response('Error fetching sitemap data', { status: 500 });
        })
      );
    }
  });
  
  getSitemap().then(data => {
    // console.log('Sitemap data:', data);
  }).catch(error => {
    console.error('Error:', error);
  });