const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./core/i18n/request.ts');

const nextConfig = {
  // Configuration Next.js
};

module.exports = withNextIntl(nextConfig);