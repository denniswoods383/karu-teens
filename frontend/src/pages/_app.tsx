import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useAutoLogout } from '../hooks/useAutoLogout'

export default function App({ Component, pageProps }: AppProps) {
  useAutoLogout();
  return <Component {...pageProps} />
}