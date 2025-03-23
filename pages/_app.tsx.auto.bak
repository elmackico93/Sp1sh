import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { SWRConfig } from 'swr';
import { Layout } from '../components/layout/Layout';
import { ScriptsProvider } from '../context/ScriptsContext';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered: ', registration);
          })
          .catch(registrationError => {
            console.log('Service Worker registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <SWRConfig 
        value={{
          fetcher: (url: string) => fetch(url).then(res => res.json()),
          revalidateOnFocus: false,
        }}
      >
        <ScriptsProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ScriptsProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
