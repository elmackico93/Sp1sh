import { useRef, useState, useEffect } from 'react';

/**
 * Hook to manage the search transition animation
 * Provides functionality to capture positions of elements and manage animation state
 */
export const useSearchTransition = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSearchSticky, setIsSearchSticky] = useState(false);
  const searchInputRef = useRef(null);
  const heroRef = useRef(null);
  const targetPositionRef = useRef(null);

  /**
   * Capture the positions needed for the animation
   * This calculates the transformation from hero search to sticky search
   */
  const capturePositions = () => {
    if (!heroRef.current || !searchInputRef.current || !targetPositionRef.current) {
      return { x: 0, y: 0, scale: 1 };
    }

    const heroRect = heroRef.current.getBoundingClientRect();
    const searchRect = searchInputRef.current.getBoundingClientRect();
    const targetRect = targetPositionRef.current.getBoundingClientRect();

    // Calculate center-to-center translation
    const startX = searchRect.left + searchRect.width / 2;
    const startY = searchRect.top + searchRect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    // Calculate translation from center to center
    const x = endX - startX;
    const y = endY - startY;

    // Calculate scale based on width ratio
    const scale = targetRect.width / searchRect.width;

    return { x, y, scale };
  };

  /**
   * Initiate the search transition animation
   */
  const initiateSearchTransition = () => {
    setIsAnimating(true);
    
    // After the animation completes, update states
    setTimeout(() => {
      setIsAnimating(false);
      setIsSearchSticky(true);
    }, 800); // Slightly longer than the animation to ensure completion
  };

  /**
   * Reset the search transition animation
   */
  const resetSearchTransition = () => {
    setIsSearchSticky(false);
  };

  return {
    isAnimating,
    isSearchSticky,
    searchInputRef,
    heroRef,
    targetPositionRef,
    capturePositions,
    initiateSearchTransition,
    resetSearchTransition
  };
};

export default useSearchTransition;
