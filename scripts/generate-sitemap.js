const fs = require('fs');
const path = require('path');

// Get the site URL from environment variables or use a default
const siteUrl = process.env.SITE_URL || 'https://weather-dashboard.vercel.app';

// Define the pages to include in the sitemap
const pages = [
  '/',
  // Add other static pages here if you have them
];

// Generate the sitemap XML content
const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
      .map((page) => {
        return `
  <url>
    <loc>${siteUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
      })
      .join('')}
</urlset>
`;

  return sitemap;
};

// Generate robots.txt content
const generateRobots = () => {
  return `# *
User-agent: *
Allow: /

# Host
Host: ${siteUrl}

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml
`;
};

// Write the sitemap to the public directory
const writeSitemap = () => {
  const sitemap = generateSitemap();
  const robots = generateRobots();

  const publicDir = path.join(process.cwd(), 'public');

  // Ensure the public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write sitemap.xml
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');

  // Write robots.txt
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
  console.log('Robots.txt generated successfully!');
};

// Execute the script
writeSitemap(); 