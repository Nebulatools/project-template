const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '../.next',
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  webpack(config) {
    const postcssConfigPath = path.join(__dirname, 'assets/styles/postcss.config.js')

    const applyPostcssConfig = (rules) => {
      if (!Array.isArray(rules)) {
        return
      }

      rules.forEach((rule) => {
        if (!rule) {
          return
        }

        const updateLoaderOptions = (useEntry) => {
          if (useEntry && typeof useEntry === 'object' && useEntry.loader && useEntry.loader.includes('postcss-loader')) {
            useEntry.options = useEntry.options || {}
            useEntry.options.postcssOptions = useEntry.options.postcssOptions || {}
            useEntry.options.postcssOptions.config = postcssConfigPath
          }
        }

        if (rule.loader && rule.loader.includes('postcss-loader')) {
          rule.options = rule.options || {}
          rule.options.postcssOptions = rule.options.postcssOptions || {}
          rule.options.postcssOptions.config = postcssConfigPath
        }

        if (rule.use) {
          const uses = Array.isArray(rule.use) ? rule.use : [rule.use]
          uses.forEach(updateLoaderOptions)
        }

        if (rule.oneOf) {
          applyPostcssConfig(rule.oneOf)
        }

        if (rule.rules) {
          applyPostcssConfig(rule.rules)
        }
      })
    }

    applyPostcssConfig(config.module.rules)

    return config
  },
  async rewrites() {
    return [
      // Map kebab-case URLs to camelCase page files
      { source: '/auth/password-reset', destination: '/auth/passwordReset' },
      { source: '/auth/password-update', destination: '/auth/passwordUpdate' },
      { source: '/account/my-profile', destination: '/account/myProfile' },
    ]
  },
}

module.exports = nextConfig