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
