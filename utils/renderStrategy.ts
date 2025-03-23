/**
 * Advanced rendering strategy utilities for Sp1sh
 */

import type { GetServerSideProps, GetStaticProps } from 'next';

// Data that changes frequently needs SSR
export const withServerSideRendering = (
  getDataFn?: (context: any) => Promise<any>
): GetServerSideProps => {
  return async (context) => {
    try {
      // If data fetching function provided, use it
      if (getDataFn) {
        const data = await getDataFn(context);
        return {
          props: {
            ...data,
            renderedAt: new Date().toISOString(),
          },
        };
      }
      
      // Default minimal props
      return {
        props: {
          renderedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Error in SSR data fetching:', error);
      return {
        props: {
          error: 'Failed to load data',
          renderedAt: new Date().toISOString(),
        },
      };
    }
  };
};

// Static content can use SSG with revalidation
export const withStaticRendering = (
  getDataFn?: (context: any) => Promise<any>,
  revalidateTime: number = 60 * 30 // Default 30 minutes
): GetStaticProps => {
  return async (context) => {
    try {
      // If data fetching function provided, use it
      if (getDataFn) {
        const data = await getDataFn(context);
        return {
          props: {
            ...data,
            renderedAt: new Date().toISOString(),
          },
          revalidate: revalidateTime,
        };
      }
      
      // Default minimal props
      return {
        props: {
          renderedAt: new Date().toISOString(),
        },
        revalidate: revalidateTime,
      };
    } catch (error) {
      console.error('Error in SSG data fetching:', error);
      return {
        props: {
          error: 'Failed to load data',
          renderedAt: new Date().toISOString(),
        },
        revalidate: 60, // Retry sooner on error
      };
    }
  };
};

// Hybrid rendering detection (for client-side adaptation)
export const isServerSide = typeof window === 'undefined';

// Performance monitoring for render strategies
export const measureRenderPerformance = () => {
  if (typeof window !== 'undefined' && typeof performance !== 'undefined') {
    const metrics = {
      FCP: 0, // First Contentful Paint
      TTI: 0, // Time to Interactive
      LCP: 0, // Largest Contentful Paint
    };
    
    // First Contentful Paint
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.FCP = entry.startTime;
          console.log(`First Contentful Paint: ${metrics.FCP}ms`);
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
    
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.LCP = lastEntry.startTime;
      console.log(`Largest Contentful Paint: ${metrics.LCP}ms`);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // Time to Interactive approximation
    let timeToInteractive = 0;
    const TTIEstimator = () => {
      const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
      const firstInput = performance.getEntriesByType('first-input')[0];
      
      if (firstInput) {
        timeToInteractive = Math.max(domContentLoaded, firstInput.processingStart);
      } else {
        timeToInteractive = domContentLoaded;
      }
      
      metrics.TTI = timeToInteractive;
      console.log(`Time To Interactive (estimate): ${metrics.TTI}ms`);
    };
    
    window.addEventListener('load', () => {
      // Wait for potential first user interaction
      setTimeout(TTIEstimator, 5000);
    });
    
    return metrics;
  }
  
  return null;
};
