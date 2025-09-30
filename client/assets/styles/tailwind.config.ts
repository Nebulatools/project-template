import path from 'path'
import type { Config } from 'tailwindcss'

const clientDir = path.join(__dirname, '..', '..')
const withClient = (glob: string) => path.join(clientDir, glob)

const config: Config = {
  content: [
    withClient('pages/**/*.{js,ts,jsx,tsx,mdx}'),
    withClient('components/**/*.{js,ts,jsx,tsx,mdx}'),
    withClient('app/**/*.{js,ts,jsx,tsx,mdx}')
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: []
}

export default config