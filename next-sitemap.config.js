/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://limperatrice-app.vercel.app',
  generateRobotsTxt: true,
}
