/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    return [
      // Map kebab-case URLs to snake_case page files
      { source: '/auth/password-reset', destination: '/auth/password_reset' },
      { source: '/auth/password-update', destination: '/auth/password_update' },
      { source: '/account/my-profile', destination: '/account/my_profile' },
    ]
  },
}

module.exports = nextConfig
