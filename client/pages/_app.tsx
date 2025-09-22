import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import '../assets/styles/globals.css'
import '../assets/styles/styles.css'
import { AuthProvider } from '../components/auth/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  )
}
