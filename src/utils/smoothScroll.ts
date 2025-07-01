import gsap from 'gsap';

// Register ScrollToPlugin
if (typeof window !== 'undefined') {
  // Dynamic import to ensure it only runs on client side
  import('gsap/ScrollToPlugin').then(module => {
    const { ScrollToPlugin } = module;
    gsap.registerPlugin(ScrollToPlugin);
  });
}

/**
 * Smooth scroll to a specific element or position
 * @param {string | HTMLElement} target - The target element or selector
 * @param {number} offset - Offset from the top (default: 0)
 * @param {number} duration - Animation duration in seconds (default: 1)
 */
export const smoothScroll = (
  target: string | HTMLElement,
  offset: number = 0,
  duration: number = 1
): void => {
  if (typeof window === 'undefined') return;
  
  gsap.to(window, {
    duration,
    scrollTo: {
      y: target,
      offsetY: offset,
    },
    ease: 'power3.inOut',
  });
};

/**
 * Set up smooth scrolling for all anchor links
 * @param {number} offset - Offset from the top (default: 0)
 */
export const initSmoothScrolling = (offset: number = 0): void => {
  if (typeof window === 'undefined') return;

  // Ensure ScrollToPlugin is loaded before setting up
  import('gsap/ScrollToPlugin').then(() => {
    // Get all anchor links that point to an ID on the page
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        if (targetId === '#') return;
        
        smoothScroll(targetId as string, offset);
      });
    });
  });
}; 