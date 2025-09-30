const path = require('path')

const tailwindConfigPath = path.join(__dirname, 'tailwind.config.ts')

module.exports = {
  plugins: {
    tailwindcss: { config: tailwindConfigPath },
    autoprefixer: {},
  },
}