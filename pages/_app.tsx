// pages/_app.tsx
import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { SWRConfig } from 'swr';
import { Layout } from '../components/layout/Layout';
import { ScriptsProvider } from '../context/ScriptsContext';
import { NavigationProvider } from '../context/NavigationContext';
import { TerminalProvider } from '../context/TerminalContext';
import { cachedFetcher, registerServiceWorker } from '../utils/cache';
import { detectSlowRenders } from '../utils/performanceMonitoring';
import useRouterPatch from '../hooks/useRouterPatch';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { PerformanceReport } from '../components/ui/PerformanceReport';

export default function App({ Component, pageProps }: AppProps) {
  // Apply router patch to handle SecurityErrors
  useRouterPatch();

  // Register service worker for caching
  useEffect(() => {
    // Initialize performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      detectSlowRenders();
    }
    
    // Register service worker in production
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <SWRConfig 
        value={{
          fetcher: cachedFetcher,
          revalidateOnFocus: false,
          revalidateIfStale: true,
          revalidateOnReconnect: true,
          refreshInterval: 0,
          dedupingInterval: 2000,
        }}
      >
        <ScriptsProvider>
          <NavigationProvider>
            <TerminalProvider>
              <Layout>
                <Component {...pageProps} />
                {process.env.NODE_ENV === 'development' && <PerformanceReport />}
              </Layout>
            </TerminalProvider>
          </NavigationProvider>
        </ScriptsProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}