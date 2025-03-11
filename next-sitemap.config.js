/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
  // Update the siteUrl to your actual deployed URL
  /** Without additional '/' on the end */
  siteUrl: process.env.SITE_URL || 'https://weather-dashboard.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  // Disable openSiteMaps to fix the 401 error
  generateIndexSitemap: false,
  autoLastmod: true,
};
