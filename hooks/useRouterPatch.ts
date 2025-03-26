import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * This hook patches the Next.js router to handle SecurityError exceptions
 * that can occur during history manipulation operations.
 */
export function useRouterPatch() {
  const router = useRouter();
  
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Store original push method
    const originalPush = router.push;
    
    // Override push method with safe version
    router.push = function safePush(...args) {
      try {
        return originalPush.apply(this, args);
      } catch (err) {
        if (err.name === 'SecurityError') {
          console.warn('Security error during navigation, using fallback method');
          // Use direct location change as fallback
          window.location.href = typeof args[0] === 'string' 
            ? args[0] 
            : args[0].pathname + (args[0].search || '');
          return Promise.resolve(false);
        }
        throw err;
      }
    };
    
    // Cleanup
    return () => {
      router.push = originalPush;
    };
  }, [router]);
}

export default useRouterPatch;