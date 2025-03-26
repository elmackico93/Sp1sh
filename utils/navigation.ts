/**
 * Navigation utility to help with proper routing in Next.js
 */

import { useRouter } from 'next/router';

/**
 * Enhanced back function that ensures proper navigation when the back button is pressed
 * Falls back to homepage if there's no history
 */
export const goBack = () => {
  const router = useRouter();
  
  if (window.history.length > 1) {
    router.back();
  } else {
    // No history, redirect to home
    router.push('/');
  }
};

/**
 * Navigate to a specific script page
 */
export const navigateToScript = (scriptId: string) => {
  const router = useRouter();
  router.push(`/scripts/${scriptId}`);
};

/**
 * Navigate to category page
 */
export const navigateToCategory = (category: string) => {
  const router = useRouter();
  router.push(`/categories/${category}`);
};

/**
 * Navigate to OS page
 */
export const navigateToOS = (os: string) => {
  const router = useRouter();
  router.push(`/os/${os}`);
};

/**
 * Safe navigation function that handles browser security constraints
 */
export const safeNavigate = (
  url: string, 
  options?: { 
    shallow?: boolean;
    scroll?: boolean;
    replace?: boolean;
  }
) => {
  const router = useRouter();
  
  // Ensure the URL is properly formatted and same-origin
  try {
    // For absolute URLs, check if they're same-origin
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      const currentUrl = new URL(window.location.href);
      
      // If different origin, use regular navigation
      if (urlObj.origin !== currentUrl.origin) {
        window.location.href = url;
        return;
      }
      
      // Extract the path+query for same-origin URLs
      url = urlObj.pathname + urlObj.search + urlObj.hash;
    }
    
    // Use Next.js router for same-origin navigation
    if (options?.replace) {
      router.replace(url, undefined, {
        shallow: options.shallow,
        scroll: options.scroll !== false
      });
    } else {
      router.push(url, undefined, {
        shallow: options.shallow,
        scroll: options.scroll !== false
      });
    }
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to basic navigation
    window.location.href = url;
  }
};

/**
 * Safe back navigation function
 */
export const safeGoBack = () => {
  try {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // No history, redirect to home
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to home
    window.location.href = '/';
  }
};