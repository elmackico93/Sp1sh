// hooks/useSearchTransition.tsx
import { useState, useRef, useEffect } from 'react';

export const useSearchTransition = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSearchSticky, setIsSearchSticky] = useState(false);
  const searchInputRef = useRef(null);
  const heroRef = useRef(null);
  const targetPositionRef = useRef(null);
  
  // Calculate the search input's initial and target positions
  const capturePositions = () => {
    if (!searchInputRef.current || !targetPositionRef.current) return null;
    
    const initialRect = searchInputRef.current.getBoundingClientRect();
    const targetRect = targetPositionRef.current.getBoundingClientRect();
    
    return {
      x: targetRect.left - initialRect.left,
      y: targetRect.top - initialRect.top,
      scale: targetRect.width / initialRect.width
    };
  };

  // Trigger the search transition animation
  const initiateSearchTransition = () => {
    setIsAnimating(true);
    
    // After animation completes, set search to sticky
    setTimeout(() => {
      setIsAnimating(false);
      setIsSearchSticky(true);
    }, 600); // Match this to your animation duration
  };

  // Reset the animation state
  const resetSearchTransition = () => {
    setIsAnimating(false);
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