import '../styles/globals.css'
import '../styles/landing.css'
import '../styles/markdown-editor.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <Component {...pageProps} />
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
