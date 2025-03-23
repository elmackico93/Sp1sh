/**
 * Performance Monitoring Utils for Development
 */

// Helper to detect slow renders
export const detectSlowRenders = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  if (typeof window !== 'undefined') {
    // Detect slow renders in React components
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Slow render')) {
        console.trace('Slow render detected:');
      }
      originalConsoleWarn.apply(console, args);
    };
    
    // Log navigation performance
    const logNavigationPerformance = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        console.log('Navigation Performance:');
        console.log(`- DNS lookup: ${navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart}ms`);
        console.log(`- Connection: ${navigationEntry.connectEnd - navigationEntry.connectStart}ms`);
        console.log(`- Response time: ${navigationEntry.responseEnd - navigationEntry.responseStart}ms`);
        console.log(`- DOM Content Loaded: ${navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart}ms`);
        console.log(`- Load event: ${navigationEntry.loadEventEnd - navigationEntry.loadEventStart}ms`);
      }
    };
    
    window.addEventListener('load', () => {
      setTimeout(logNavigationPerformance, 0);
    });
  }
};

// Get all resource timings for performance analysis
export const getResourceTimings = () => {
  if (typeof window === 'undefined') return [];
  
  return performance.getEntriesByType('resource').map(entry => {
    // Cast to ResourceTiming to access resource-specific properties
    const resource = entry as PerformanceResourceTiming;
    return {
      name: resource.name,
      initiatorType: resource.initiatorType,
      startTime: resource.startTime,
      duration: resource.duration,
      transferSize: resource.transferSize,
      decodedBodySize: resource.decodedBodySize,
    };
  });
};

// Helper to identify render-blocking resources
export const identifyRenderBlockingResources = () => {
  if (typeof window === 'undefined') return [];
  
  const blockers = [];
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const navigationStart = performance.timing.navigationStart;
  const firstPaint = performance.getEntriesByType('paint')
    .find(entry => entry.name === 'first-paint')?.startTime || 0;
  
  for (const resource of resources) {
    // Resources that finished loading after first paint and started before it
    // are potentially render blocking
    if (resource.startTime < firstPaint && resource.responseEnd > firstPaint) {
      blockers.push({
        url: resource.name,
        type: resource.initiatorType,
        duration: resource.duration,
        size: resource.transferSize,
      });
    }
  }
  
  return blockers;
};
