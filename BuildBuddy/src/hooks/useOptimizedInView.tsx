import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * A hook that provides optimized in-view detection with performance throttling
 * to prevent excessive re-renders during scrolling.
 * 
 * @param threshold - Intersection threshold percentage (0-1)
 * @param triggerOnce - Whether to trigger only once
 * @param rootMargin - Root margin value
 * @returns [ref, inView] - Reference to attach to element and boolean indicating if in view
 */
export default function useOptimizedInView(
  threshold: number = 0.3,
  triggerOnce: boolean = false,
  rootMargin: string = '0px'
) {
  // Use the regular useInView hook
  const [ref, inViewRaw] = useInView({
    threshold,
    triggerOnce,
    rootMargin
  });

  // State for the debounced inView value
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inViewRaw && !inView) {
      // Immediately set to true when element comes into view
      setInView(true);
    } else if (!inViewRaw && inView && !triggerOnce) {
      // Add slight delay when going out of view to prevent flickering
      const timeout = setTimeout(() => {
        setInView(false);
      }, 200);
      
      return () => clearTimeout(timeout);
    }
  }, [inViewRaw, inView, triggerOnce]);

  return [ref, inView];
}
